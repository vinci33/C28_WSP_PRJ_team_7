import express from "express";
export const checkoutRoutes = express.Router();
import { client } from "../main";
import { isLoggedIn } from "../guards";

checkoutRoutes.get('/cartItemsByUserId', async (req, res) => {
    try {
        const user_id = req.session?.userId
        const cartItems = await client.query(/*sql*/`SELECT 
            shopping_cart.id AS cart_id,
            products.image_one as image_one, products.product_name as product_name,
            products.product_details as product_details, 
            products.product_color as product_color,
            products.product_size as product_size, 
            products.selling_price as selling_price, 
            products.image_one as image_one, 
            product_id, product_quantity, user_id
        from shopping_cart inner join products
            on shopping_cart.product_id = products.id 
            where user_id = $1 order by shopping_cart.created_at`,
            [user_id])
        res.json(cartItems.rows)
    } catch (err) {
        res.status(400).json({ success: false, msg: "error occurred" });
    }
})

checkoutRoutes.post("/orders", async (req, res) => {
    try {
        const user_id = req.session?.userId
        const cartItems = await client.query(/*sql*/`SELECT 
            shopping_cart.id AS cart_id,
            products.image_one as image_one, products.product_name as product_name,
            products.product_details as product_details, 
            products.product_color as product_color,
            products.product_size as product_size, 
            products.selling_price as selling_price, 
            products.image_one as image_one, 
            product_id, product_quantity, user_id
        from shopping_cart inner join products
            on shopping_cart.product_id = products.id 
            where user_id = $1 order by shopping_cart.created_at`,
            [user_id])

        const cartItemsToOrders = cartItems.rows
        let total_amount = cartItemsToOrders.reduce((previous, current) => {
            const product_total_price = current.product_quantity * current.selling_price
            const total_amount = previous + product_total_price
            return total_amount
        }, 0);

        req.session.total_amount = total_amount
        if (req.session.total_amount !== req.body.total_amount || user_id !== req.body.user_id) {
            res.status(400).json({ success: false, msg: "input invalid" });
            return
        }
        const orderId = await client.query(/*sql*/`INSERT INTO orders (
            user_id, 
            total_amount, 
            payment_status, 
            payment_method)
        VALUES ($1,$2,$3,$4) RETURNING id`,
            [req.body.user_id, req.body.total_amount,
            req.body.payment_status, req.body.payment_method]
        )
        req.session.orderId = orderId.rows[0].id
        res.status(200).json(orderId.rows)
    } catch (err: any) {
        console.log(err.message)
    }
})


checkoutRoutes.post("/orderDetailItems", isLoggedIn, async (req, res) => {
    try {
        for (let i = 0; i < req.body.cartItems.length; i++) {
            await client.query(/*sql*/`INSERT INTO 
            order_detail_items(
            order_id,
            product_id,
            product_name,  
            product_color,
            product_size,
            product_quantity,
            selling_price,
            product_total_price)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
                [req.body.orderId[0].id, req.body.cartItems[i].product_id,
                req.body.cartItems[i].product_name, req.body.cartItems[i].product_color,
                req.body.cartItems[i].product_size, req.body.cartItems[i].product_quantity,
                req.body.cartItems[i].selling_price, req.body.cartItems[i].product_total_price])
        }
        res.json({ success: true, msg: "checkout success" })
    } catch (err: any) {
        console.log(err.message)
        res.status(400).json({ success: false, msg: "Unable to order details" });
    }
})


checkoutRoutes.post("/deliveryConAdd", isLoggedIn, async (req, res) => {
    try {
        const { address, contact } = req.body;
        const orderId: number | undefined = req.session.orderId

        if (!orderId) {
            res.status(400).json({ success: false, msg: "order id not found" });
            return
        }
        if (isNaN(contact.phone)) {
            res.status(400).json({ success: false, msg: "Phone Number is not a number" });
            return
        } if (isNaN(address.postal_code)) {
            res.status(400).json({ success: false, msg: "Postal-Code is not a number" });
            return
        }
        const delivery_contactSql = `INSERT INTO delivery_contacts (
          order_id, first_name, last_name, phone, email
        ) VALUES (($1),$2,$3,$4, $5
        ) RETURNING id`;
        const delivery_addressSql = `INSERT INTO delivery_address (
          address1, address2, street, city, postal_code, country, delivery_contact_id
        ) VALUES ( $1, $2, $3, $4, $5, $6, $7)`;
        const delivery_contactSqlData = await client.query(delivery_contactSql,
            [orderId, contact.first_name,
                contact.last_name, contact.phone,
                contact.email])
        const delivery_contactId = delivery_contactSqlData.rows[0].id
        await client.query(delivery_addressSql,
            [address.address1, address.address2,
            address.street, address.city,
            address.postal_code, address.country,
                delivery_contactId])
        res.json({ success: true, msg: "Delivery info updated" })
    } catch (err: any) {
        console.log(err.message)
        res.status(400).json({ success: false, msg: "Unable to update delivery info" });
    }
})

checkoutRoutes.delete("/deleteCartItems", async (req, res) => {
    try {
        const user_id = req.session?.userId
        await client.query(/*sql*/`DELETE FROM shopping_cart WHERE user_id = $1`, [user_id])
        res.json({ success: true, msg: "Cart items deleted" })
    } catch (err: any) {
        console.log(err.message)
        res.status(400).json({ success: false, msg: "Unable to delete cart items" });
    }
})
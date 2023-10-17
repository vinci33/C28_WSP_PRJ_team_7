import express from "express";
export const shoppingCartRoutes = express.Router();
import { client } from "../main";


shoppingCartRoutes.get('/shoppingCart.html/products', async (req, res) => {
    try {
        const user_id = req.session?.userId
        const queryResult = await client.query(/*sql*/
            `SELECT shopping_cart.id AS cart_id, products.image_one as image_one, products.product_name as product_name,
             products.product_details as product_details, products.product_color as product_color,
             products.product_size as product_size, products.selling_price as selling_price, 
             products.image_one as image_one, product_id, product_quantity from shopping_cart inner join products
             on shopping_cart.product_id = products.id where user_id = $1 order by shopping_cart.created_at`, [user_id])
        res.json(queryResult.rows)
    } catch (err) {
        res.status(400).json({ success: false, msg: "error occurred" });
    }
})

shoppingCartRoutes.delete('/shoppingCart.html', async (req, res) => {
    const user_id = req.session?.userId
    const product_id = req.body.product_id;
    if (!user_id) {
        res.status(400).json({
            status: false,
            message: "Please Login First"
        })
        return
    }
    try {
        const sql = `delete from shopping_cart where user_id = $1 AND product_id = $2`
        await client.query(sql, [user_id, product_id])
        res.json({ success: true, msg: "success" })
    } catch (err) {
        res.status(400).json({ success: false, msg: "error occurred" });
    }
})

shoppingCartRoutes.put("/updateQuantity", async (req, res) => {
    const product_quantity = req.body.product_quantity;
    const shoppingCartId = req.body?.cart_id
    try {
        const updateId = await client.query
            (/*sql*/`UPDATE shopping_cart SET product_quantity = $1 
            WHERE id = $2  RETURNING id`, [product_quantity, shoppingCartId])
        res.json({ success: true, msg: `${updateId} update success` })
    } catch (err) {
        res.status(400).json({ success: false, msg: "Unable update quantity" });
    }
})


import express from "express";
export const orderHistoryRoutes = express.Router();
import { client } from "../main";
import { isLoggedIn } from "../guards";


orderHistoryRoutes.get('/orderHistory.html/orders', async (req, res) => {
    try {
        const user_id = req.session?.userId
        const deliveryQueryResult = await client.query(/*sql*/
            `SELECT orders.id, orders.total_amount as total_amount, orders.payment_status as payment_status,
             orders.payment_method as payment_method, orders.created_at as created_at,
             delivery_contacts.first_name as first_name, delivery_contacts.last_name as last_name, 
             delivery_contacts.phone as phone, delivery_address.address1 as address1,
             delivery_address.address2 as address2, delivery_address.street as street,
             delivery_address.city as city, delivery_address.country as country
             from orders
             inner join delivery_contacts on delivery_contacts.order_id = orders.id
             inner join delivery_address on delivery_address.delivery_contact_id = delivery_contacts.id
             where user_id = $1 
             order by orders.created_at desc`
            , [user_id])
        res.json(deliveryQueryResult.rows)
    } catch (err) {
        res.status(400).json({ success: false, msg: "error occurred" });
    }
})

orderHistoryRoutes.get("/orderHistory.html/orderData", isLoggedIn, async (req, res) => {
    try {
        const order_id = parseInt(req.query.orderId as string);
        if (isNaN(order_id)) {
            res.status(400).json({ success: false, msg: "id is not a number" });
            return;
        }
        const results = await client.query(/*sql*/
            `SELECT product_name, product_color, product_quantity, 
            selling_price, product_total_price FROM orders 
            LEFT JOIN order_detail_items ON orders.id = order_detail_items.order_id
            WHERE orders.id = $1`, [order_id]);
        res.send(results.rows)
    } catch (err: any) {
        console.error(err.message)
        res.status(400).json({ success: false, msg: "error occurred" });
    }
});

import express from "express";
export const proDetailRoutes = express.Router();
import { client } from "../main";
import { isLoggedIn } from "../guards";
import { ShoppingCart } from "../model";

proDetailRoutes.get("/productDetail/:id", isLoggedIn, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ success: false, msg: "id is not a number" });
            return;
        }
        const results = await client.query(/*sql*/ `SELECT * FROM products WHERE id = $1`, [id]);
        res.send(results.rows[0])
    } catch (err) {
        res.status(400).json({ success: false, msg: `unable to retrieve product with id ${req.params.id}` });
    }

});

proDetailRoutes.put("/cartItem", async (req, res) => {
    try {
        const cartItem: ShoppingCart = await req.body;
        const checkQuantityQuery = await client.query(
            /*sql*/ `SELECT * FROM shopping_cart WHERE user_id = $1 AND product_id = $2`,
            [req.session?.userId, cartItem.product_id])
        if (checkQuantityQuery.rows.length != 0) {
            cartItem.product_quantity += checkQuantityQuery.rows[0].product_quantity

            await client.query(
                /*sql*/ `UPDATE shopping_cart SET product_quantity = $1 WHERE user_id = $2 AND product_id = $3`,
                [cartItem.product_quantity, req.session?.userId, cartItem.product_id])

            res.json({ success: true, msg: "item added to cart" })
            return
        }
        let shoppingCartId = await client.query(/*sql*/ `INSERT INTO shopping_cart (user_id, product_id, product_quantity ) 
        VALUES ($1, $2, $3) RETURNING id `,
            [req.session?.userId, cartItem.product_id, cartItem.product_quantity]);
        req.session.cartCount = req.session.cartCount ? req.session.cartCount + 1 : 1
        req.session.shoppingCartId = shoppingCartId.rows[0].id
        res.json({ success: true, msg: "item added to cart" })
    } catch (err: any) {
        console.error(err.message);
        res.status(400).json({ success: false, msg: "unable to add item to cart" });
    }
})

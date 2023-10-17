import express from "express";
export const productRoutes = express.Router();
import { client } from "../main";
import { Colors, Products } from "../model";
import { convertStr2Arr } from '../utils';



productRoutes.get("/products", async (req, res) => {
    try {
        const queryResult = await client.query(/*sql*/
            `SELECT products.id, categories_name, product_name, product_color, selling_price, image_one, products.created_at
            from categories inner join products on categories.id = products.category_id order by products.created_at desc limit 4`)
        let products: Products[] = queryResult.rows
        res.send(products);
    } catch (err) {
        res.status(400).json({ success: false, msg: "error occurred" });
    }
})


productRoutes.get("/product.html/product_categories", (req, res) => {
    client.query(/*sql*/ `select categories_name from categories`, function (err, results) {
        if (err) {
            res.status(400).send({ message: "error occurred" });
        }
        res.send(results.rows);
    });
})

productRoutes.get("/product.html/product_colors", async (req, res) => {
    try {
        const results = await client.query(/*sql*/ `SELECT product_color FROM products`);
        const colors: Colors[] = results.rows;
        res.send(Array.from(new Set(colors.map((elem) => elem.product_color))));
    } catch (err) {
        res.status(400).send({ success: false, msg: "error occurred" });
    }
});

productRoutes.get("/product.html/all_products", async (req, res) => {
    try {
        const categories = convertStr2Arr(req.query.category)
        const colors = convertStr2Arr(req.query.product_color)
        const queryResult = await client.query(/*sql*/
            `SELECT products.id, categories_name, product_name, product_color, selling_price, image_one, products.created_at
            from categories inner join products on categories.id = products.category_id order by products.created_at desc`)
        let products: Products[] = queryResult.rows
        if (categories) {
            products = products.filter((product) => categories?.includes(product.categories_name))
        }
        if (colors) {
            products = products.filter((product) => colors?.includes(product.product_color))
        }
        res.send(products);
    } catch (err) {
        res.status(400).json({ success: false, msg: "error occurred" });
    }
})


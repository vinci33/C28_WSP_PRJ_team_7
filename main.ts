import express from 'express';
import expressSession from 'express-session';
import path from 'path';
import { Client } from "pg";
import dotenv from "dotenv";
import { convertStr2Arr } from './utils';
import { Colors, Products } from './model';

const app = express();


app.use(express.json());
app.use(
    expressSession({
        secret: "Byran Kenneth and Paul",
        resave: true,
        saveUninitialized: true,
    })
);


dotenv.config();
const client = new Client({
    database: process.env.DB_NAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
});
client.connect();

app.get("/product.html/product_categories", (req, res) => {
    client.query(/*sql*/ `select categories_name from categories`, function (err, results) {
        if (err) {
            res.status(400).send({ message: "error occurred" });
        }
        res.send(results.rows);
    });
})

app.get("/product.html/product_colors", async (req, res) => {
    try {
        const results = await client.query(/*sql*/ `SELECT product_color FROM products`);
        const colors: Colors[] = results.rows;
        res.send(Array.from(new Set(colors.map((elem) => elem.product_color))));
    } catch (err) {
        res.status(400).send({ success: false, msg: "error occurred" });
    }
});

app.get("/product.html/all_products", async (req, res) => {
    try {
        const categories = convertStr2Arr(req.query.category)
        const colors = convertStr2Arr(req.query.product_color)
        const queryResult = await client.query(/*sql*/
            `SELECT products.id, categories_name, product_name, product_color, selling_price, image_one, products.modified_at
            from categories inner join products on categories.id = products.category_id order by products.modified_at desc`)
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


// 仲未加check user ID
app.get('/shoppingCart.html/products', async (req, res) => {
    try {
        const queryResult = await client.query(/*sql*/
            `SELECT products.image_one as image_one, products.product_name as product_name,
             products.product_details as product_details, products.product_color as product_color,
             products.product_size as product_size, products.selling_price as selling_price, 
             products.image_one as image_one, product_quantity from shopping_cart inner join products
             on shopping_cart.product_id = products.id order by shopping_cart.modified_at`)
        res.json(queryResult.rows)
    } catch (err) {
        res.status(400).json({ success: false, msg: "error occurred" });
    }
})

// 仲未加user id
// app.delete('/shoppingCart.html', async (req, res) => {

// }


app.get("/proDetail.html/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ success: false, msg: "id is not a number" });
            return
        }
        const results = await client.query(/*sql*/ `SELECT * FROM products WHERE id = $1`, [id]);
        res.send(results.rows[0])
    } catch (err) {
        res.status(400).json({ success: false, msg: `unable to retrieve product with id ${req.params.id}` });
    }
});

// app.get("/products.html/:id/", async (req, res) => {
//     const results = await client.query(/*sql*/ `SELECT * FROM products WHERE id = $1`, [req.params.id]);
//     let result = results.rows
//     console.log(result)
//     res.send(results.rows[0]);
// })


app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'public/html')))

app.use((_req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', '404.html'))
})

const PORT = 8080
app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`)
})
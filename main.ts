import express from 'express';
import expressSession from 'express-session';
import path from 'path';
import { Client } from "pg";
import dotenv from "dotenv";
import { convertStr2Arr } from './utils';

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

interface Colors {
    product_color: string;
}

app.get("/product.html/product_colors", async (req, res) => {
    try {
        const results = await client.query(/*sql*/ `SELECT product_color FROM products`);
        const colors: Colors[] = results.rows;
        res.send(Array.from(new Set(colors.map((elem) => elem.product_color))));
    } catch (err) {
        res.status(400).send({ message: "error occurred" });
    }
});

// Query: Filter
interface products {
    categories_name: string;
    product_name: string;
    product_color: string;
    selling_price: number;
    image_one: string;
    modified_at: string;
}

app.get("/product.html/allproducts", async (req, res) => {
    try {
        const categories = convertStr2Arr(req.query.category)
        const colors = convertStr2Arr(req.query.product_color)
        const queryResult = await client.query(
            `SELECT categories_name, product_name, product_color, selling_price, image_one, products.modified_at
            from categories inner join products on categories.id = products.category_id`)
        let products: products[] = queryResult.rows
        if (categories) {
            products = products.filter((product) => categories?.includes(product.categories_name))
        }
        if (colors) {
            products = products.filter((product) => colors?.includes(product.product_color))
        }
        res.send(products);
    } catch (e) {
        res.status(400).send({ message: "error occurred" });
    }
})


// this is the route for the product page for the product with the id Fm KDL
// app.get("/proDetail.html/products/:id", async (req, res) => {
//     try {
//         const id = parseInt(req.params.id);
//         if (isNaN(id)) {
//             res.status(400).json({ success: false, msg: "id is not a number" });
//             return
//         }
//         const results = await client.query(/*sql*/ `SELECT * FROM products WHERE id = $1`, [id]);
//         console.log(results.rows[0]);
//         res.send(results.rows[0]);
//     } catch (err) {
//         res.status(400).json({ success: false, msg: `unable to retrieve product with id ${req.params.id}` });
//     }
// });

app.get("/products.html/:id/", async (req, res) => {
    const results = await client.query(/*sql*/ `SELECT * FROM products WHERE id = $1`, [req.params.id]);
    let result = results.rows
    console.log(result)
    res.send(results.rows[0]);
})


app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'public/html')))

app.use((_req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', '404.html'))
})

const PORT = 8080
app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`)
})
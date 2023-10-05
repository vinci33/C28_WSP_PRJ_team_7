import express from 'express';
import expressSession from 'express-session';
import path from 'path';
import { Client } from "pg";
import dotenv from "dotenv";

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

app.get("/product_categories", (req, res) => {
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

app.get("/product_colors", async (req, res) => {
    try {
        const results = await client.query(/*sql*/ `SELECT product_color FROM products`);
        const colors: Colors[] = results.rows;
        res.send(Array.from(new Set(colors.map((elem) => elem.product_color))));
    } catch (err) {
        res.status(400).send({ message: "error occurred" });
    }
});

// app.get("/product_categories", async (req, res) => {
//     let products: Product[] = await readJsonFile(PRODUCT_JSON_PATH);
//     const categories = convertStr2Arr(req.query.category);
//     if (categories) {
//         products = products.filter((product) => categories.includes(product.category));
//     }
//     res.json(products);
// });




app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'public/html')))

app.use((_req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', '404.html'))
})

const PORT = 8080
app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`)
})
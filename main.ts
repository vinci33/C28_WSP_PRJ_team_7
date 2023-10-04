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
async function main() {
    const client = new Client({
        database: process.env.DB_NAME,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
    });
    await client.connect();
    await client.end();
}

// #TODO Revise it later once SQL created
import { ParsedQs } from "qs";
function convertStr2Arr(query: string | string[] | ParsedQs | ParsedQs[] | undefined) {
    if (typeof query === "undefined" || Array.isArray(query)) {
        return query;
    }
    return [query];
}

async function readJsonFile(filepath: string) {
    const data = await jsonfile.readFile(filepath);
    return data;
}


app.get("./products", async (req, res) => {
    let products: Product[] = await readJsonFile(PRODUCT_JSON_PATH);
    const categories = convertStr2Arr(req.query.category);
    if (categories) {
        products = products.filter((product) => categories.includes(product.category));
    }
    res.json(products);
});


// #TODO Revise it later once SQL created
app.get("./categories", async (req, res) => {
    const products: Product[] = await readJsonFile(PRODUCT_JSON_PATH);
    res.json(Array.from(new Set(products.map((p) => p.category))));
});



app.use(express.static(path.join(__dirname, 'public')))

app.use((_req, res) => {
    res.sendFile(path.join(__dirname, 'public', '404.html'))
})

const PORT = 8080
app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`)
})
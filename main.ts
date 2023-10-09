import express from 'express';
import expressSession from 'express-session';
import path from 'path';
import { Client } from "pg";
import dotenv from "dotenv";
import { convertStr2Arr } from './utils';
import { Colors, Products, ShoppingCart } from './model';
// import { isLoggedIn } from './guards'

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

declare module 'express-session' {
    interface SessionData {
        userId?: number
        cartCount?: number
    }
}

app.post('/create-account', (req, res) => {
    const { email, password } = req.body;

    // Insert the user registration information into the "users" table
    const query = 'INSERT INTO users (email, password, created_at, modified_at) VALUES ($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *';
    const values = [email, password];

    client
        .query(query, values)
        .then((result) => {
            res.status(200).json({ message: 'Account created!', user: result.rows[0] });
        })
        .catch((err) => {
            console.error('Error creating account:', err);
            res.status(500).json({ message: 'Error creating account' });
        });
});




app.use((req, _res, next) => {
    req.session.userId = 1
    next()
});

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


// 仲未加check user ID && user id
// 加左product id
app.get('/shoppingCart.html/products', async (req, res) => {
    try {
        // const user_id = req.params.user
        const queryResult = await client.query(/*sql*/
            `SELECT products.image_one as image_one, products.product_name as product_name,
             products.product_details as product_details, products.product_color as product_color,
             products.product_size as product_size, products.selling_price as selling_price, 
             products.image_one as image_one, product_id, product_quantity from shopping_cart inner join products
             on shopping_cart.product_id = products.id order by shopping_cart.modified_at where shopping_cart.used_name = `)
        res.json(queryResult.rows)
    } catch (err) {
        res.status(400).json({ success: false, msg: "error occurred" });
    }
})

// 仲未加user id
app.delete('/shoppingCart.html', async (req, res) => {
    try {
        const product_id = req.body.product_id;
        const sql = `delete from shopping_cart where product_id = $1`
        await client.query(sql, [product_id])
        res.json({ success: true, msg: "success" })
    } catch (err) {
        res.status(400).json({ success: false, msg: "error occurred" });
    }
})



app.get("/productDetail/:id", async (req, res) => {
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

app.post("/cartItem", async (req, res) => {
    try {
        const cartItem: ShoppingCart = await req.body;
        // console.log(cartItem, req.session.userId)
        let shoppingCartId = await client.query(/*sql*/ `INSERT INTO shopping_cart (user_id, product_id, product_quantity ) 
            VALUES ($1, $2, $3) RETURNING id `,
            [req.session.userId, cartItem.product_id, cartItem.product_quantity]);
        console.log(shoppingCartId.rows[0]);
        req.session.cartCount = req.session.cartCount ? req.session.cartCount + 1 : 1
        console.log(req.session.cartCount)
        res.json({ success: true, msg: "item added to cart" })
    } catch (err) {
        res.status(400).json({ success: false, msg: "unable to add item to cart" });
    }
})

app.get("/cartCount", async (req, res) => {
    try {
        res.json({ success: true, cartCount: req.session.cartCount })
    } catch (err) {
        res.status(400).json({ success: false, msg: "unable to get cart count" });
    }

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

export { Client };

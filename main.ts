import express from 'express';
import expressSession from 'express-session';
import { Router } from 'express';
import path from 'path';
import { Client } from "pg";
import dotenv from "dotenv";
import { convertStr2Arr } from './utils';
import { Colors, Products, ShoppingCart } from './model';
import { isLoggedIn } from './guards'
import { hashPassword, checkPassword } from './hash';
import grant from "grant";
import { userRoutes } from './userRoutes';


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
        userId?: number;
        email?: string;
        shoppingCartId?: number
        cartCount?: number
        grant?: any;
    }
}

const grantExpress = grant.express({
    defaults: {
        origin: "http://localhost:8080",
        transport: "session",
        state: true,
    },
    google: {
        key: process.env.GOOGLE_CLIENT_ID || "",
        secret: process.env.GOOGLE_CLIENT_SECRET || "",
        scope: ["profile", "email"],
        callback: "/login/google",
    },

});


app.use(grantExpress as express.RequestHandler);
app.use('/', userRoutes)

// app.use((rqe, _res, next) => {
//     console.log(`Request path: ${rqe.path}, method: ${rqe.method}`);
//     next();
// })


// TODO can be delete later
// app.use((req, res, next) => {
//     req.session.userId = 1;
//     next();
// })



app.post('/create-account', (req, res) => {
    const { email, password } = req.body;

    // Generate a hashed password
    hashPassword(password)
        .then((hashedPassword) => {
            // Insert the user database into the "users" table
            const query = 'INSERT INTO users (email, password, created_at, modified_at) VALUES ($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *';
            const values = [email, hashedPassword];

            client.query(query, values)
                .then((result) => {
                    res.status(200).json({ message: 'Account created!', user: result.rows[0] });
                })
                .catch((err) => {
                    console.error('Error creating account:', err);
                    res.status(500).json({ message: 'Error creating account' });
                });
        })
        .catch((err) => {
            console.error('Error hashing password:', err);
            res.status(500).json({ message: 'Error creating account' });
        });
});

app.post('/login', async (req, res) => {
    try {
        console.log(req.body);

        const result = await client.query(
            `SELECT users.id, users.email, users.password FROM users WHERE users.email = $1`,
            [req.body.email]
        );
        const user = result.rows[0];

        if (!user || !(await checkPassword({ plainPassword: req.body.password, hashedPassword: user.password }))) {
            console.log('Invalid login');
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        console.log('Login success');
        req.session.userId = user.id;
        return res.json({ message: 'Login successful', userId: user.id });
    } catch (error) {
        console.error('An error occurred during login:', error);
        return res.status(500).json({ error: 'An error occurred during login' });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy((error) => {
        console.log('out of session');
        if (error) {
            console.error('Error occurred during session destruction:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        console.log('Logged out');
        res.redirect('/');
        console.log('isLoggedOut');
        return;
    });
});


// Changing the Login Button to Logout Button
app.get('/login-status', (req, res) => {
    try {
        if (req.session.userId) {
            // User is logged in
            res.json({ isLoggedIn: true });
            console.log('User is logged in');
        } else {
            // User is not logged in
            res.json({ isLoggedIn: false });
            console.log('User is not logged in');
        }
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});




app.get("/products", async (req, res) => {
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

app.get('/shoppingCart.html/products', async (req, res) => {
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

app.delete('/shoppingCart.html', async (req, res) => {
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





app.get("/proDetail.html", isLoggedIn, async (req, res, next) => { next() })

app.get("/productDetail/:id", isLoggedIn, async (req, res) => {
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

app.post("/cartItem", async (req, res) => {
    try {
        const cartItem: ShoppingCart = await req.body;
        console.log(cartItem, req.session?.userId)
        const checkQuantityQuery = await client.query(
            /*sql*/ `SELECT * FROM shopping_cart WHERE user_id = $1 AND product_id = $2`,
            [req.session?.userId, cartItem.product_id])
        console.log(checkQuantityQuery.rows.length, checkQuantityQuery.rows)
        if (checkQuantityQuery.rows.length != 0) {
            cartItem.product_quantity += checkQuantityQuery.rows[0].product_quantity
            console.log(cartItem.product_quantity)
            const updateQuantityQueryResult = await client.query(
                /*sql*/ `UPDATE shopping_cart SET product_quantity = $1 WHERE user_id = $2 AND product_id = $3`,
                [cartItem.product_quantity, req.session?.userId, cartItem.product_id])
            console.log(updateQuantityQueryResult.rows)
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

app.get("SoppingId", async (req, res) => { })

app.put("/updateQuantity", async (req, res) => {
    const product_quantity = req.body.product_quantity;
    const shoppingCartId = req.body?.cart_id
    console.log(product_quantity, shoppingCartId)
    try {
        const updateId = await client.query
            (/*sql*/`UPDATE shopping_cart SET product_quantity = $1 
            WHERE id = $2  RETURNING id`, [product_quantity, shoppingCartId])
        console.log(updateId.rows)
        res.json({ success: true, msg: `${updateId} update success` })
    } catch (err) {
        res.status(400).json({ success: false, msg: "error occurred" });
    }
})


app.get("/cartCount", async (req, res) => {
    try {
        res.json({ success: true, cartCount: req.session.cartCount })
    } catch (err) {
        res.status(400).json({ success: false, msg: "unable to get cart count" });
    }

})

app.get('/orderHistory.html/orders', async (req, res) => {
    try {
        const user_id = req.session?.userId
        const deliveryQueryResult = await client.query(/*sql*/
            `SELECT orders.total_amount as total_amount, orders.payment_status as payment_status,
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

app.post("/checkout", isLoggedIn, async (req, res) => {
    try {
        const { address, contact } = req.body;
        console.log(address, contact);
        console.log(`this is the shopping_cart_id:${req.session.shoppingCartId}`)
        console.log(`this is the user_id:${req.session.userId}`)
        await client.query(/*sql*/`WITH d_contacts AS(
            INSERT INTO delivery_contacts(
                user_id,
                first_name,
                last_name,
                phone,
                email
            ) VALUES($1, $2, $3, $4, $5)
            RETURNING id
        )INSERT INTO delivery_address(
            address1,
            address2,
            street,
            city,
            postal_code,
            country,
            delivery_contact_id
        ) VALUES($6, $7, $8, $9, $10, $11,
            (SELECT id FROM d_contacts AS delivery_contact_id))`,
            [req.session.userId, contact.first_name,
            contact.last_name, contact.phone,
            contact.email,
            address.address1,
            address.address2, address.street,
            address.city, address.postal_code,
            address.country]);

        console.log(2)

        await client.query(/*sql*/`WITH cart_items AS(
                SELECT
              user_id,
                product_id,
                product_quantity
            FROM shopping_cart
            WHERE
              shopping_cart.user_id = $1
            ), product_details AS(
                SELECT
              cart_items.product_id,
                products.product_name,
                products.product_color,
                products.product_size,
                products.selling_price
            FROM cart_items
              JOIN products ON cart_items.product_id = products.id
            ), inserted_order AS(
                INSERT INTO orders(user_id, product_id, product_quantity,
                    total_amount, payment_status, payment_method)
            VALUES(
                        (SELECT
              cart_items.user_id,
                        cart_items.product_id,
                        cart_items.product_quantity,
                        SUM(product_quantity * selling_price) AS total_amount,
                        'pending' AS payment_status,
                        'credit card' AS payment_method
            FROM cart_items
              JOIN product_details ON product_details.product_id = cart_items.product_id
            GROUP BY
              user_id, cart_items.product_id))
            RETURNING id, user_id
          )

          INSERT INTO order_detail_items(order_id, product_id, product_name, product_color, product_size, product_quantity, selling_price, product_total_price)
SELECT
inserted_order.id AS order_id,
    cart_items.product_id,
    product_details.product_name,
    product_details.product_color,
    product_details.product_size,
    cart_items.product_quantity,
    product_details.selling_price,
    cart_items.product_quantity * product_details.selling_price AS product_total_price
FROM
cart_items
            JOIN product_details ON cart_items.product_id = product_details.product_id
            JOIN inserted_order ON cart_items.user_id = inserted_order.user_id; `,
            [req.session?.userId])


        res.json({ success: true, msg: "checkout success" })
    } catch (err: any) {
        console.error(err.message)
        res.status(400).json({ success: false, msg: "unable to checkout" });
    }
})

// async function insertOrder(shopping_cart_id) {
//     await client.query(/*sql*/`SELECT 
//     user_id,
//     product_id,
//     INSERT INTO orders (
//         user_id, total_amount, payment_status, payment_method)
//         VALUES ($1, $2, $3, $4) RETURNING id`, [])
// }

const router = Router();
// Protected route example
router.get('/protected-route', isLoggedIn, (req, res) => {
    // This route will only be accessible if the user is logged in
    res.send('You are logged in!');
});

export default router;

// app.use('/', userRoutes)
app.use('/resources', isLoggedIn) // protected resources

// app.use(express.static('public'))



// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// const DOMAIN = process.env.DOMAIN;

// console.log(DOMAIN, stripe)

// app.post('/create-checkout-session', async (req, res) => {
//     const products = await client.query(/*sql*/`SELECT * FROM products`);
//     const storeProducts = products.rows;
//     console.log(storeProducts)
//     const session = await stripe.checkout.sessions.create({
//         payment_method_types: ['card'],
//         mode: 'payment',
//         line_items: req.body.items.map((item: any) => {
//             // const storeItem = storeItems.get(item.id);
//             return {
//                 // price_data: {
//                 //     currency: 'hkd',
//                 //     product_data: {
//                 //         name: storeItem.name,
//                 //         images: [storeItem.image],
//                 //     },
//                 //     unit_amount: storeItem.price,
//                 // },
//                 // quantity: item.quantity,
//             };
//         }),
//         success_url: `${DOMAIN}/success.html`,
//         success_url: `${ DOMAIN } /success.html`,
//         cancel_url: `${DOMAIN}/cancel.html`,
//     });

//     res.redirect(303, session.url);
// });

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'public', "html")))


app.use((_req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', '404.html'))
})

const PORT = 8080
app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`)
})



export { client };
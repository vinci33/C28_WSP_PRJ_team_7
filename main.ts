import express from 'express';
import expressSession from 'express-session';
import { Router } from 'express';
import path from 'path';
import { Client } from "pg";
import dotenv from "dotenv";
import { isLoggedIn } from './guards'
import { hashPassword, checkPassword } from './hash';
import grant from "grant";
import { userRoutes } from './userRoutes';
import { checkoutRoutes } from './routes/checkOutRoutes';
import { orderHistoryRoutes } from './routes/orderHistoryRoutes';
import { shoppingCartRoutes } from './routes/shoppingCartRoutes';
import { proDetailRoutes } from './routes/proDetailRoutes';
import { productRoutes } from './routes/productRoutes';


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
        orderId?: number
        total_amount?: number
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

// Assuming you have the necessary imports and setup for your server-side application
async function emailExistsInDataStorage(email: string) {
    try {
        // Replace this with your actual logic to check email existence in your data storage mechanism
        // Example: Query your database to check if the email exists
        // Return true if the email exists, or false otherwise
        // Your implementation may vary depending on the specific database or data storage mechanism you are using

        const result = await client.query('SELECT COUNT(*) FROM users WHERE email = ?', [email]);

        const count = parseInt(result.rows[0].count, 10);

        return count > 0;
    } catch (error) {
        console.error('Error checking email existence:', error);
        return false;
    }
}

app.post('/check-email-existence', async (req, res) => {
    const email = req.body.email;

    try {
        const exists = await emailExistsInDataStorage(email);

        res.json({ exists });
    } catch (error) {
        console.error('Error checking email existence:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


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
                    req.session.userId = result.rows[0].id;
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
            console.log(`User is logged in session number/userId: ${req.session.userId}`);
        } else {
            // User is not logged in
            res.json({ isLoggedIn: false });
            console.log(`User is not logged in session number/userId:${req.session.userId}`);
        }
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});



// product
app.get("/products", productRoutes);

app.get("/product.html/product_categories", productRoutes);

app.get("/product.html/product_colors", productRoutes);

app.get("/product.html/all_products", productRoutes);


// productDetail
app.get("/proDetail.html", isLoggedIn, async (req, res, next) => { next() });

app.get("/productDetail/:id", isLoggedIn, proDetailRoutes);

app.put("/cartItem", proDetailRoutes);


// shoppingCart
app.put("/updateQuantity", shoppingCartRoutes);

app.get('/shoppingCart.html/products', shoppingCartRoutes);

app.delete('/shoppingCart.html', shoppingCartRoutes);


// orderHistory 
app.get('/orderHistory.html/orders', orderHistoryRoutes);

app.get("/orderHistory.html/orderData", isLoggedIn, orderHistoryRoutes);


// checkout
app.get('/cartItemsByUserId', checkoutRoutes);

app.post("/orders", checkoutRoutes);

app.post("/orderDetailItems", isLoggedIn, checkoutRoutes);


app.post("/deliveryConAdd", isLoggedIn, checkoutRoutes);

app.delete("/deleteCartItems", checkoutRoutes);




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
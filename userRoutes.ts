import express from 'express';
import { client } from "./main";
import { hashPassword } from './hash';
const crypto = require('crypto');
export const userRoutes = express.Router();

userRoutes.get('/login/google', loginGoogle);

async function loginGoogle(req: express.Request, res: express.Response) {
    console.log('google login')
    const accessToken = req.session?.['grant'].response.access_token;
    const fetchRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        method: "get",
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    });

    const result = await fetchRes.json();
    const users = (await client.query(`SELECT * FROM users WHERE email = $1`, [result.email])).rows;

    let currentUser = users[0];

    if (!currentUser) {
        // Create the user when the user does not exist
        currentUser = (await client.query(
            `INSERT INTO users (email,password)
                VALUES ($1,$2) RETURNING *`,
            [result.email, await hashPassword(crypto.randomBytes(20).toString())])
        ).rows[0]

        return res.redirect('/signupSuccess.html');
    }

    if (req.session) {
        req.session.userId = currentUser.id;
    }

    return res.redirect('/loginSuccess.html')
}
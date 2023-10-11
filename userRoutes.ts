// import express, { Request, Response } from 'express'
// import { checkPassword } from './hash'
// import { client } from './main'

// export const userRoutes = express.Router()
// userRoutes.post('/login', login)

// async function login(req: Request, res: Response) {
//   const { email, password } = req.body
//   const result = await client.query(
//     `SELECT * FROM users WHERE users.email = $1`,
//     [email],
//   )

//   const user = result.rows[0]
//   if (!email) {
//     res.status(401).json({ error: 'Wrong Email or Password' })
//     return;
//   }

//   const match = await checkPassword({
//     plainPassword: password,
//     hashedPassword: user.password,
//   })
//   if (!match) {
//     res.status(401).json({ error: 'Wrong Email or Password' })
//     return;
//   }
//   if (!req.session) {
//     res.status(412).json({ error: 'Missing request session' })
//     return;
//   }

//   req.session.userId = { 
//     userId: user.id, email: user.email}
//   res.json({ success: true, message: "success" })
// };
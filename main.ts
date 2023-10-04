import express from 'express';
import expressSession from 'express-session';
import path from 'path';


const app = express();

// Third party middleware
app.use(express.json());
app.use(
    expressSession({
        secret: "Byran Kenneth and Paul",
        resave: true,
        saveUninitialized: true,
    })
);

app.use(express.static(path.join(__dirname, 'public')))

app.use((_req, res) => {
    res.sendFile(path.join(__dirname, 'public', '404.html'))
})

const PORT = 8080
app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`)
})
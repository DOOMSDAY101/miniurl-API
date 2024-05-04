require('dotenv').config();
const express = require('express');
const shortid = require('short-unique-id');
const mysql = require('mysql');

//DB CREDENTIALS
const db = mysql.createConnection({
    host: process.env.DB_HOST_NAME,
    user: process.env.DB_USER_NAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

const app = express();

let bodyParser = require('body-parser');
let cors = require('cors');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors('*'))

const { randomUUID } = new shortid({ length: 10 })

// INITIATE DB CONNECTION
 db.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
 });

app.post('/shorten', (req, res) => {
    const { url } = req.body;

    db.query('SELECT * FROM links WHERE original_url = (?)', [url], (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ error: 'Internal server error' })
        }
        if (result.length > 0) {
            // If the original URL already has a short URL, send it to the user
            const { short_id } = result[0];
            return res.status(200).json({ originalUrl: url, shortUrl: `${process.env.SERVER_HOST}/${short_id}`, status: 200 });
        } else {
            // Generate a new short ID and insert the original URL into the database
            let shorturlid = randomUUID();
            db.query('INSERT INTO links (original_url, short_id) VALUES (?,?)', [url, shorturlid], (err, result) => {
                if (err) {
                    console.log(err)
                    return res.status(500).json({ error: 'Internal server error' });
                }
                return res.status(200).json({ originalUrl: url, shortUrl: `${process.env.SERVER_HOST}/${shorturlid}`, status: 200 })
            })
        }
    })
})

// app.get('/delete', (req, res) => {
//     db.query('DELETE FROM links', (err, result) => {
//         if (err) console.log(err)
//         console.log("deleted")
//         res.send("deleted")
//     })
// })
app.get('/:shortId', (req, res) => {
    const { shortId } = req.params;

    db.query('SELECT original_url FROM links WHERE short_id = (?)', [shortId], (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ error: 'Internal server error' })
        }
        if (result.length === 0) return res.status(404).json({ error: 'URL NOT FOUND' })
        let originalUrl = result[0].original_url;
        if (!/^https?:\/\//i.test(originalUrl)) {
            originalUrl = 'http://' + originalUrl; // Default to http if no protocol is specified
        }
        res.redirect(originalUrl);
    })
})

app.listen(process.env.PORT, () => {
    console.log(`Server started on port `, process.env.PORT)
})

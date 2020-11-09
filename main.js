// process.env.BASE_URL = "http://localhost:3000";

const http = require('http');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const session = require('cookie-session');

//
// const helmet = require("helmet"); //Adds Secure Response Headers to Each Request
const compression = require('compression'); //Compress data and sends to response automatically

const db = require('./util/database');
// Controllers
const userController = require('./controllers/user');

const app = express();

// app.use(helmet());
// app.use(compression());

// Templating Engine Setup
app.set('view engine', 'ejs');
// app.set('views', 'views');

// Routers
// const userRoutes = require('./routes/user');

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.static(path.join('public'))); //grant html resource files permission to load
// app.use(session({ secret: 'We1c0me@123', resave: false, saveUninitialized: false }));

// app.use(userRoutes);

// Index Page
// app.get('/', userController.getIndex);
app.get('/', (req, res, next) => {
    console.log('first in');
    res.send('Hello World!!!!');
});

/*
//Error 500 page
app.get('/500', (req, res, next) => {
    res.status(500).render('500', { title: 'ExpressMusicX | 500 Error Page' });
});

// 404
app.use((req, res, next) => {
    res.render('404', { title: 'ExpressMusicX | 404 Page not found' });
});
*/

const server = http.createServer(app);

//Start Server only after connecting to DB
db.getConnection()
    .then((conn) => {
        console.log('DB Connection Successfull');
        server.listen(process.env.PORT || 3000);
    })
    .catch((e) => {
        console.log('DB Connection Error');
    });

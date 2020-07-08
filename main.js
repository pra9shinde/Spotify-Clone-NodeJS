const http = require('http');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const db = require('./util/database');

// Controllers
const userController = require('./controllers/user');

const app = express();

// Templating Engine Setup
app.set('view engine', 'ejs');
app.set('views', 'views');

// Routers
const userRoutes = require('./routes/user');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join('public'))); //grant html resource files permission to load

app.use(userRoutes);

// Index Page
app.get('/', userController.getIndex);

// 404
app.use((req, res, next) => {
    res.render('404', { title: 'ExpressMusicX | Page not found' });
})

const server = http.createServer(app);

server.listen(3000);
//Load Models
const Account = require('../models/Account');

// Load index page view
exports.getIndex = (req, res, next) => {
    console.log('Server Working');
    // res.send('<h1>ExpressMusicX</h1>');
    res.render('index', { title: 'ExpressMusicX' });
};

// Register page view
exports.getRegister = (req, res, next) => {
    const data = {
        userName: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        password2: ''
    };
    res.render('register', { title: 'ExpressMusicX - Register', formData: data })
};

// Post /login request
exports.login = (req, res, next) => {
    console.log(req.body);
    // res.send('<h1>Login Successfull</h1>');
    res.redirect('/');
}

// Register POST
exports.register = (req, res, next) => {
    const username = stripTags(req.body.username);
    const firstname = stripTags(req.body.firstName);
    const lastname = stripTags(req.body.lastName);
    const email = stripTags(req.body.email);
    const password = stripTags(req.body.password);
    const password2 = stripTags(req.body.password2);

    const account = new Account();

    const isSuccessfull = account.register(username, firstname, lastname, email, password, password2);
    if (isSuccessfull) {
        res.redirect('/');
    } else {
        const data = {
            userName: username,
            firstName: firstname,
            lastName: lastname,
            email: email,
            password: password,
            password2: password2
        }
        res.render('register', { title: 'ExpressMusicX - Register', errorsObj: account, formData: data });
    }

};

// remove all html tags if user inserts into text input
const stripTags = text => text.replace(/(<([^>]+)>)/ig, "").trim();

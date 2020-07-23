//Load Models
const Account = require("../models/Account");
const Songs = require('../models/Songs');

const data = {
	userName: "",
	firstName: "",
	lastName: "",
	email: "",
	password: "",
	password2: ""
};

// Load index page view
exports.getIndex = (req, res, next) => {
	if (!req.session.loggedinUser) {
		return res.render("register", {
			title: "ExpressMusicX - Register",
			formData: data,
			loginUsername: ''
		});
	}

	//Get all albums
	Songs.fetchAllAlbums()
		.then(result => {
			result = Object.values(JSON.parse(JSON.stringify(result[0])));
			res.render("index", { title: "ExpressMusicX", 'albums': result });
		})
		.catch(e => {
			console.log(e);
		});
};

// Register page view
exports.getRegister = (req, res, next) => {
	res.render("register", { title: "ExpressMusicX - Register", formData: data, loginUsername: '' });
};

// Post /login request
exports.login = (req, res, next) => {
	const username = req.body.loginUsername;
	const password = req.body.loginPassword;

	const account = new Account();

	account.login(username, password)
		.then((result) => {
			if (result.status === "failed") {
				res.render("register", {
					title: "ExpressMusicX - Register",
					errorsObj: account,
					formData: data,
					loginUsername: username,
					src: 'login'
				});
			} else {
				req.session.loggedinUser = username;
				res.redirect("/");
			}
		})
		.catch((e) => {
			console.log(e);
		});
};

// Register POST
exports.register = (req, res, next) => {
	const username = stripTags(req.body.username);
	const firstname = stripTags(req.body.firstName);
	const lastname = stripTags(req.body.lastName);
	const email = stripTags(req.body.email);
	const password = stripTags(req.body.password);
	const password2 = stripTags(req.body.password2);

	const account = new Account();

	account.register(username, firstname, lastname, email, password, password2)
		.then((result) => {
			if (result) {
				req.session.loggedinUser = username;
				res.redirect("/");
			} else {
				res.render("register", {
					title: "ExpressMusicX - Register",
					errorsObj: account,
					formData: data,
					loginUsername: username,
					src: 'reg'
				});
			}
		});
};

// remove all html tags if user inserts into text input
const stripTags = (text) => text.replace(/(<([^>]+)>)/gi, "").trim();

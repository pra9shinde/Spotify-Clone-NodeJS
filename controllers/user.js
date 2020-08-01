//Load Models
const Account = require("../models/Account");
const Songs = require('../models/Songs');
const Artist = require('../models/Artist');
const User = require('../models/User');

const { json } = require("body-parser");

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
			res.render("index", { title: "ExpressMusicX", 'albums': result, loggedInUser: req.session.loggedinUserFullName, isAjaxRequest: req.xhr });
		})
		.catch(e => {
			console.log(e);
		});
};

// Register page view
exports.getRegister = (req, res, next) => {
	res.render("register", { title: "ExpressMusicX - Register", formData: data, loginUsername: '' });
};

// Single Album Details Page
exports.getAlbum = (req, res, next) => {
	if (!req.session.loggedinUser) {
		return res.render("register", {
			title: "ExpressMusicX - Register",
			formData: data,
			loginUsername: ''
		});
	}

	const albumID = req.query.id;
	if (albumID) {
		let songs = new Songs();

		songs.getAllAlbumDetails(albumID)
			.then(result => {
				if (!result) {
					res.redirect('/');
				} else {
					// console.log(result.albumDet);
					res.render('album', { title: "ExpressMusicX - Album Details", data: result, loggedInUser: req.session.loggedinUserFullName, isAjaxRequest: req.xhr });
				}
			})
			.catch(e => console.log(e));
	} else {
		res.redirect('/');
	}


};

// Artist view
exports.getArtist = (req, res, next) => {
	if (!req.session.loggedinUser) {
		return res.render("register", {
			title: "ExpressMusicX - Register",
			formData: data,
			loginUsername: ''
		});
	}

	const artistID = req.query.id;
	if (artistID) {
		const artist = new Artist(artistID);

		artist.getArtistPageDetails()
			.then(result => {
				res.render('artist', {
					title: "ExpressMusicX - Artist Details",
					loggedInUser: req.session.loggedinUserFullName,
					isAjaxRequest: req.xhr,
					data: result
				});
			})
			.catch(e => console.log(e));
	} else {
		res.redirect('/');
	}
};

//Search View
exports.getSearch = (req, res, next) => {
	if (!req.session.loggedinUser) {
		return res.render("register", {
			title: "ExpressMusicX - Register",
			formData: data,
			loginUsername: ''
		});
	}

	let term = decodeURIComponent(req.query.term);//decodeURI will remove encoded whitespaces from URL params
	if (term === 'undefined') {
		term = '';
	}

	const userLoggedInIndex = term.indexOf('userLoggedIn'); //Remove extra params
	if (userLoggedInIndex !== -1) {
		term = term.substr(0, userLoggedInIndex - 1)
	}

	const artist = new Artist();
	let output = {};

	artist.searchSongs(term)
		.then(result => {
			output.songsList = result;
			return artist.searchArtists(term); //Search artists
		})
		.then(artists => {
			output.artistList = artists;
			return artist.searchAlbums(term); //Search Albums
		})
		.then(albums => {
			output.albumList = albums;
			res.render("search", { title: "ExpressMusicX | Search", data: output, loggedInUser: req.session.loggedinUserFullName, isAjaxRequest: req.xhr, term: term });
		})
		.catch(e => console.log(e));
};

exports.getYourMusic = (req, res, next) => {
	if (!req.session.loggedinUser) {
		return res.render("register", {
			title: "ExpressMusicX - Register",
			formData: data,
			loginUsername: ''
		});
	}

	res.render('yourMusic', {
		title: "ExpressMusicX | Your Music",
		loggedInUser: req.session.loggedinUserFullName,
		isAjaxRequest: req.xhr
	});
};


/**------- Post Requests -----------**/
//login request
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
				req.session.loggedinUserFullName = result.userFullName;
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
				req.session.loggedinUserFullName = `${firstname} ${lastname}`;
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


/********** AJAX Calls ******************/
//Get random playlist songs
exports.getPlaylist = (req, res, next) => {
	Songs.getRandomPlaylist()
		.then(result => {
			let arr = [];
			let resultArray = JSON.parse(JSON.stringify(result[0]));
			resultArray.forEach(data => {
				arr.push(data.id);
			});

			res.json({ status: 'Success', playlistArray: arr });
		})
		.catch(e => console.log(e));
};

// Get Song By ID
exports.getSongByID = (req, res, next) => {
	const songID = req.body.songId;
	Songs.getSongByID(songID)
		.then(result => {
			let resultArr = JSON.parse(JSON.stringify(result[0]));
			res.json({ status: 'Success', songDetails: resultArr[0] });

		})
		.catch(e => console.log(e));
};

// Get Artist by ID
exports.getArtistByID = (req, res, next) => {
	const artistID = req.body.artistId;
	Songs.getArtistByID(artistID)
		.then(result => {
			let resultArr = JSON.parse(JSON.stringify(result[0]));
			res.json({ status: 'Success', artistDetails: resultArr[0] });
		})
		.catch(e => console.log(e));
};

// Get Album By ID
exports.getAlbumByID = (req, res, next) => {
	const albumID = req.body.albumId;
	Songs.getAlbumByID(albumID)
		.then(result => {
			let resultArr = JSON.parse(JSON.stringify(result[0]));
			res.json({ status: 'Success', albumDetails: resultArr[0] });
		})
		.catch(e => console.log(e));
};

// Update Song Play Count when song is played
exports.updatePlays = (req, res, next) => {
	const songID = req.body.songid;
	Songs.updateSongPlays(songID)
		.then(result => {
			res.json({ status: 'Success', res: result });
		})
		.catch(e => console.log(e));
};

//Create playlist
exports.createPlaylist = (req, res, next) => {
	const username = req.session.loggedinUser;
	const playlistName = req.body.name;

	if (username) {
		const user = new User(username);
		user.createPlaylist(playlistName)
			.then(result => {
				res.json({ status: 'Success', res: result });
			})
			.catch(e => console.log(e));
	} else {
		res.json({ status: 'Failure', res: 'Username not found' });
	}
};


// remove all html tags if user inserts into text input
const stripTags = (text) => text.replace(/(<([^>]+)>)/gi, "").trim();

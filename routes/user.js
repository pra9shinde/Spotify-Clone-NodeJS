const express = require('express');

const router = express.Router();

const userController = require('../controllers/user');

// Register GET request
router.get('/register', userController.getRegister);// Get ALbum Details
router.get('/album', userController.getAlbum);//Get Browse Page
router.get('/browse', userController.getIndex);
router.get('/artist', userController.getArtist);//Get Artist Details Page
router.get('/search', userController.getSearch);//Get Search Page
router.get('/yourmusic', userController.getYourMusic);//Your Music Page
router.get('/playlist', userController.getPlaylistView);//Single Playlist Details Page

// Login submit req
router.post('/login', userController.login);

// Register User
router.post('/register', userController.register);


// AJAX Calls 
router.get('/getPlaylist', userController.getPlaylist); //Get Random Playlist Songs
router.post('/getSongByID', userController.getSongByID); //Get Song Details by ID
router.post('/getArtistByID', userController.getArtistByID); //Get Artist Details by ID
router.post('/getAlbumByID', userController.getAlbumByID); //Get Artist Details by ID
router.post('/updatePlays', userController.updatePlays);//Update song play count when song is played
router.post('/createPlaylist', userController.createPlaylist); //Create new playlsit
router.post('/deletePlaylist', userController.deletePlaylist); //Delete user playlist
module.exports = router;



const express = require("express");

const router = express.Router();

const userController = require("../controllers/user");

// Register GET request
router.get("/register", userController.getRegister); // Get ALbum Details
router.get("/album", userController.getAlbum); //Get Browse Page
router.get("/browse", userController.getIndex);
router.get("/artist", userController.getArtist); //Get Artist Details Page
router.get("/search", userController.getSearch); //Get Search Page
router.get("/yourmusic", userController.getYourMusic); //Your Music Page
router.get("/playlist", userController.getPlaylistView); //Single Playlist Details Page
router.get("/profile", userController.getProfile); //User Profile View
router.get("/updateDetails", userController.getupdateDetails); //Edit User Profile View

// Login submit req
router.post("/login", userController.login);

// Register User
router.post("/register", userController.register);

// AJAX Calls
router.get("/getPlaylist", userController.getPlaylist); //Get Random Playlist Songs
router.post("/getSongByID", userController.getSongByID); //Get Song Details by ID
router.post("/getArtistByID", userController.getArtistByID); //Get Artist Details by ID
router.post("/getAlbumByID", userController.getAlbumByID); //Get Artist Details by ID
router.post("/updatePlays", userController.updatePlays); //Update song play count when song is played
router.post("/createPlaylist", userController.createPlaylist); //Create new playlsit
router.post("/deletePlaylist", userController.deletePlaylist); //Delete user playlist
router.post("/addToPlaylist", userController.addToPlaylist); //Add song to playlist
router.post("/deleteFromPlaylist", userController.deleteFromPlaylist); //Remove song from playlist
router.post("/logout", userController.logout); //User logout
router.post("/updateUserEmail", userController.updateUserEmail); //Update new email address of the user
router.post("/changeUserPassword", userController.changeUserPassword); //Change User Password

module.exports = router;

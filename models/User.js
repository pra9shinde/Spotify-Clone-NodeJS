const db = require("../util/database");
const crypto = require("crypto");

const Songs = require("../models/Songs");

class User {
    constructor(username) {
        this.username = username;
    }

    async createPlaylist(playlistName) {
        const datetime = new Date()
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");
        try {
            const res = await db.execute(
                "INSERT INTO playlist VALUES(?, ?, ?, ?)",
                ["", playlistName, this.username, datetime]
            );
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    async deletePlaylist(id) {
        try {
            const res = await db.execute("DELETE FROM playlist WHERE id = ?", [
                id,
            ]);
            const res2 = await db.execute(
                "DELETE FROM playlistsongs WHERE playlistId = ?",
                [id]
            );
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    async getUserPlaylist() {
        try {
            const result = await db.execute(
                "SELECT * FROM playlist WHERE owner=?",
                [this.username]
            );
            const resultArr = JSON.parse(JSON.stringify(result[0]));
            return resultArr;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    async getPlaylistbyID(id) {
        try {
            const result = await db.execute(
                "SELECT * FROM playlist WHERE id=?",
                [id]
            );
            const resultArr = JSON.parse(JSON.stringify(result[0]));
            if (resultArr.length > 0) {
                return resultArr[0];
            }
            return false;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    async getPlaylistSongs(id) {
        try {
            const result = await db.execute(
                "SELECT songId FROM playlistsongs WHERE playlistId=? ORDER BY playlistOrder ASC",
                [id]
            );
            const resultArr = JSON.parse(JSON.stringify(result[0]));

            //Get Song Details from SongID
            const songs = new Songs();
            const objs = await songs.createObjects();

            let songArr;
            let allSongs = [];

            //getSongByID() returns promise hence do operation after all promises are returned.
            let promises = [];
            resultArr.forEach((element) => {
                promises.push(Songs.getSongByID(element.songId));
            });
            return Promise.all(promises)
                .then((responses) => {
                    // responses will come as array of them
                    // do something after everything finishes
                    responses.forEach((song) => {
                        songArr = JSON.parse(JSON.stringify(song[0])); //sql result to JSON obj
                        songArr[0].artistName = songs.getArtistName(
                            songArr[0].artist
                        ); //get artist name from its id
                        songArr[0].albumName = songs.getAlbumName(
                            songArr[0].album
                        ); //get album name from its id
                        songArr[0].genreName = songs.getGenreName(
                            songArr[0].genre
                        ); //get genre name from its id
                        allSongs.push(songArr[0]); //push song into an array
                    });
                    return allSongs;
                })
                .catch((reason) => {
                    // catch all the errors
                    console.log(reason);
                });
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    async addtoPlaylist(playlistId, songId) {
        try {
            //check if song already present in playlist
            const songExists = await this.getSongFromPlaylist(
                playlistId,
                songId
            );
            if (songExists === true) {
                return true; //No need to add song to playlist again
            }

            const playlistOrder = await this.getPlaylistSongOrder(playlistId); //get playlist order
            if (playlistOrder === false) {
                return false;
            }

            const result = await db.execute(
                "INSERT INTO playlistsongs VALUES(?, ?, ?, ?)",
                ["", songId, playlistId, playlistOrder + 1]
            );
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    async getPlaylistSongOrder(playlistId) {
        try {
            const result = await db.execute(
                "SELECT MAX(playlistOrder) as maxOrder FROM playlistsongs WHERE playlistId=?",
                [playlistId]
            );
            const resultArr = JSON.parse(JSON.stringify(result[0]));
            if (resultArr[0].maxOrder === null) {
                return 0; //if playlist data not present in table return null
            }
            return resultArr[0].maxOrder;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    async getSongFromPlaylist(playlistId, songId) {
        try {
            const result = await db.execute(
                "SELECT songId FROM playlistsongs WHERE playlistId=? AND songId=?",
                [playlistId, songId]
            );
            const resultArr = JSON.parse(JSON.stringify(result[0]));
            if (resultArr.length > 0) {
                return true;
            } else {
                return false;
            }
        } catch (e) {
            console.log(e);
            return e;
        }
    }

    async deleteSongFromPlaylist(playlistId, songId) {
        try {
            const result = await db.execute(
                "DELETE FROM playlistsongs WHERE playlistId=? AND songId=?",
                [playlistId, songId]
            );
            return true;
        } catch (e) {
            console.log(e);
            return e;
        }
    }

    async getUserDetails() {
        try {
            const result = await db.execute(
                "SELECT * FROM users WHERE username=?",
                [this.username]
            );
            const resArr = JSON.parse(JSON.stringify(result[0]));
            if (resArr.length > 0) {
                return resArr[0];
            }
            return false;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    async updateEmail(email) {
        try {
            const result = await db.execute(
                "UPDATE users SET email = ? WHERE username=?",
                [email, this.username]
            );
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    async checkOldPassword(password) {
        try {
            const result = await db.execute(
                "SELECT password from users WHERE username= ?",
                [this.username]
            );
            const resultArr = JSON.parse(JSON.stringify(result[0]));
            if (!resultArr.length > 0) {
                return "User not found";
            }
            //Decrypt password
            let mykey2 = crypto.createDecipher("aes-128-cbc", "We1c0me@123");
            let fetchedPassword = mykey2.update(
                resultArr[0].password,
                "hex",
                "utf8"
            );
            fetchedPassword += mykey2.final("utf8");

            if (password != fetchedPassword) {
                throw new Error("Wrong Password");
            }
            return true;
        } catch (e) {
            console.log(e);
            return e.message;
        }
    }

    async updatePassword(newPassword) {
        try {
            //Encrypt Password
            let mykey = crypto.createCipher("aes-128-cbc", "We1c0me@123");
            let encryptedPass = mykey.update(newPassword, "utf8", "hex");
            encryptedPass += mykey.final("hex");

            const result = await db.execute(
                "UPDATE users SET password = ? WHERE username=?",
                [encryptedPass, this.username]
            );
            return true;
        } catch (e) {
            console.log(e);
            return e;
        }
    }
}

module.exports = User;

const db = require('../util/database');
const Songs = require('../models/Songs');


class User {
    constructor(username) {
        this.username = username;
    }

    async createPlaylist(playlistName) {
        const datetime = new Date().toISOString().slice(0, 19).replace("T", " ");
        try {
            const res = await db.execute('INSERT INTO playlist VALUES(?, ?, ?, ?)', ['', playlistName, this.username, datetime]);
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    async deletePlaylist(id) {
        try {
            const res = await db.execute('DELETE FROM playlist WHERE id = ?', [id]);
            const res2 = await db.execute('DELETE FROM playlistsongs WHERE playlistId = ?', [id]);
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    async getUserPlaylist() {
        try {
            const result = await db.execute('SELECT * FROM playlist WHERE owner=?', [this.username]);
            const resultArr = JSON.parse(JSON.stringify(result[0]));
            return resultArr;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    async getPlaylistbyID(id) {
        try {
            const result = await db.execute('SELECT * FROM playlist WHERE id=?', [id]);
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
            const result = await db.execute('SELECT songId FROM playlistsongs WHERE playlistId=? ORDER BY playlistOrder ASC', [id]);
            const resultArr = JSON.parse(JSON.stringify(result[0]));

            //Get Song Details from SongID
            const songs = new Songs();
            const objs = await songs.createObjects();

            let songArr;
            let allSongs = [];

            //getSongByID() returns promise hence do operation after all promises are returned. 
            let promises = [];
            resultArr.forEach(element => {
                promises.push(Songs.getSongByID(element.songId));
            });
            return Promise.all(promises).then(responses => {
                // responses will come as array of them
                // do something after everything finishes
                responses.forEach(song => {
                    songArr = JSON.parse(JSON.stringify(song[0])); //sql result to JSON obj
                    songArr[0].artistName = songs.getArtistName(songArr[0].artist); //get artist name from its id
                    songArr[0].albumName = songs.getAlbumName(songArr[0].album);//get album name from its id
                    songArr[0].genreName = songs.getGenreName(songArr[0].genre);//get genre name from its id
                    allSongs.push(songArr[0]);//push song into an array
                });
                return allSongs;
            }).catch(reason => {
                // catch all the errors
                console.log(reason);
            });

        } catch (e) {
            console.log(e);
            return false;
        }
    }

}

module.exports = User;
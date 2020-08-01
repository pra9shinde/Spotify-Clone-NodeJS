const db = require('../util/database');
const { json } = require('body-parser');

class Artist {
    constructor(id = 0) {
        this.id = id;

        // Save sql data into object once instead of calling again from DB {id: value}
        this.album = {};
        this.artist = {};
        this.genre = {};

    }

    //Save all artists, album, genre into an object {id: value}
    async createObjects() {
        try {
            const res = await this.getAllArtists();
            let allArtists = JSON.parse(JSON.stringify(res[0]));
            allArtists.forEach(obj => {
                this.artist[obj.id] = obj.name;
            });

            const res2 = await this.getAllAlbums();
            let allAlbums = JSON.parse(JSON.stringify(res2[0]));
            allAlbums.forEach(obj => {
                this.album[obj.id] = obj.title;
            });

            const res3 = await this.getAllGenres();
            let allGenres = JSON.parse(JSON.stringify(res3[0]));
            allGenres.forEach(obj => {
                this.genre[obj.id] = obj.name;
            });
        }
        catch (e) {
            console.log(e);
        }

    }

    async getArtistPageDetails() {
        const objects = await this.createObjects();

        let allDetails = {};

        //Get Album Artist name
        let artistDet = await this.getName();
        artistDet = JSON.parse(JSON.stringify(artistDet[0]));
        allDetails.mainArtistName = artistDet[0].name; //Main Album artist name

        //Get Artist albums
        let artistalbums = await this.getAlbums();
        artistalbums = JSON.parse(JSON.stringify(artistalbums));
        allDetails.albums = artistalbums[0];


        //Get Artist Songs
        artistDet = await this.getSongs();
        artistDet = JSON.parse(JSON.stringify(artistDet[0]));

        artistDet.forEach(song => {
            song.artistName = this.getArtistName(song.artist);
            song.albumName = this.getAlbumName(song.album);
            song.genreName = this.getGenreName(song.genre);
        });
        allDetails.songsList = artistDet;

        return allDetails;
    }

    getName() {
        return db.execute("SELECT name from artists WHERE id= ?", [this.id]);
    }

    getSongs() {
        return db.execute("SELECT * from songs WHERE artist= ? ORDER BY plays DESC", [this.id]);
    }

    getAlbums() {
        return db.execute("SELECT * from albums WHERE artist= ?", [this.id]);
    }

    getAllArtists() {
        return db.execute("SELECT * from artists");
    }

    getAllAlbums() {
        return db.execute("SELECT * from albums");
    }

    getAllGenres() {
        return db.execute("SELECT * from genres");
    }


    getAlbumName(id) {
        return this.album[id] !== 'undefined' ? this.album[id] : '';
    }

    getArtistName(id) {
        return this.artist[id] !== 'undefined' ? this.artist[id] : '';
    }

    getGenreName(id) {
        return this.genre[id] !== 'undefined' ? this.genre[id] : '';
    }

    async searchSongs(value) {
        const objects = await this.createObjects();
        const res = await db.execute(` SELECT * from songs where title LIKE '%${value}%' LIMIT 10 `);
        let resultArr = JSON.parse(JSON.stringify(res[0]));
        resultArr.forEach(song => {
            song.artistName = this.getArtistName(song.artist);
            song.albumName = this.getAlbumName(song.album);
            song.genreName = this.getGenreName(song.genre);
        });
        return resultArr;
    }

    async searchArtists(value) {
        const res = await db.execute(` SELECT * from artists where name LIKE '%${value}%' LIMIT 10 `);
        let resultArr = JSON.parse(JSON.stringify(res[0]));
        return resultArr;
    }

    async searchAlbums(value) {
        const res = await db.execute(` SELECT * from albums where title LIKE '%${value}%' LIMIT 10 `);
        let resultArr = JSON.parse(JSON.stringify(res[0]));
        return resultArr;
    }
}

module.exports = Artist;
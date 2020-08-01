const db = require('../util/database');

class Songs {
    constructor() {
        // create objects as per thier ID
        this.album = {};
        this.artist = {};
        this.genre = {};
    }

    // Get Album, Artist, Genres, Song Details
    async getAllAlbumDetails(albumID) {
        let allDetails = {};

        //Get Album Details
        let albumDet = await Songs.getAlbumByID(albumID);
        albumDet = JSON.parse(JSON.stringify(albumDet[0]));
        this.arrangeAlbum(albumDet);

        // Get Artist  Details
        let artistDet = await Songs.getArtistByID(albumDet[0].artist);
        artistDet = JSON.parse(JSON.stringify(artistDet[0]));
        this.arrangeArtist(artistDet);

        // Get Genre Details
        let genreDet = await Songs.getGenreByID(albumDet[0].genre);
        genreDet = JSON.parse(JSON.stringify(genreDet[0]));
        this.arrangeGenre(genreDet);


        // Get Album Songs
        let getTotalSongsFromAlbum = await Songs.getTotalSongsFromAlbum(albumDet[0].id);
        getTotalSongsFromAlbum = JSON.parse(JSON.stringify(getTotalSongsFromAlbum[0]));
        const totalSongs = getTotalSongsFromAlbum.length;


        getTotalSongsFromAlbum.forEach(song => {
            song.artistName = this.getArtistName(song.artist);
            song.albumName = this.getAlbumName(song.album);
            song.genreName = this.getGenreName(song.genre);
        });

        allDetails.albumDet = albumDet;
        allDetails.artistDet = artistDet;
        allDetails.songsList = getTotalSongsFromAlbum;
        allDetails.albumDet[0].totalSongs = totalSongs;

        if (albumDet.length > 0 && artistDet.length > 0) {
            return allDetails;
        } else {
            return false;
        }
    }

    arrangeAlbum(arrObj) {
        arrObj.forEach(obj => {
            this.album[obj.id] = obj.title;
        });
    }

    arrangeArtist(arrObj) {
        arrObj.forEach(obj => {
            this.artist[obj.id] = obj.name;
        });
    }

    arrangeGenre(arrObj) {
        arrObj.forEach(obj => {
            this.genre[obj.id] = obj.name;
        });
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

    static async getRandomPlaylist() {
        return await db.execute('SELECT id from songs ORDER BY RAND() LIMIT 10');
    }

    static async getSongByID(id) {
        return await db.execute("SELECT * from songs WHERE id= ?", [id]);
    }

    static fetchAllAlbums() {
        return db.execute("SELECT * from albums ORDER BY RAND() LIMIT 10");
    }

    static getAlbumByID(id) {
        return db.execute("SELECT * from albums WHERE id= ?", [id]);
    }

    static getArtistByID(id) {
        return db.execute("SELECT * from artists WHERE id= ?", [id]);
    }

    static getGenreByID(id) {
        return db.execute("SELECT * from genres WHERE id= ?", [id]);
    }

    static getTotalSongsFromAlbum(id) {
        return db.execute("SELECT * from songs WHERE album= ? ORDER BY albumOrder ASC", [id]);
    }

    static updateSongPlays(id) {
        // Get current play count
        let fetchedId = id;
        return this.getSongByID(id)
            .then(result => {
                let resultArr = JSON.parse(JSON.stringify(result[0]));
                return resultArr[0].plays;
            })
            .then(play => {
                let newPlays = Number(play) + 1;
                return db.execute('UPDATE songs SET plays = ? WHERE id = ?', [newPlays, fetchedId]);
            })
            .then(res => {
                return JSON.parse(JSON.stringify(res[0]));
            })
            .catch(e => console.log(e));
    }

}

module.exports = Songs;
const db = require('../util/database');

class Songs {
    constructor() {
        // create objects as per thier ID
        this.album = {};
        this.artist = {};
        this.genre = {};
    }

    async createObjects() {
        //Get Album Details
        let albumDet = await this.getAllAlbums();
        albumDet = JSON.parse(JSON.stringify(albumDet[0]));
        albumDet.forEach(obj => {
            this.album[obj.id] = obj.title;
        });

        // Get Artist  Details
        let artistDet = await this.getAllArtists();
        artistDet = JSON.parse(JSON.stringify(artistDet[0]));
        artistDet.forEach(obj => {
            this.artist[obj.id] = obj.name;
        });

        // Get Genre Details
        let genreDet = await this.getAllGenres();
        genreDet = JSON.parse(JSON.stringify(genreDet[0]));
        genreDet.forEach(obj => {
            this.genre[obj.id] = obj.name;
        });
    }

    // Get Album, Artist, Genres, Song Details
    async getAllAlbumDetails(albumID) {
        let allDetails = {};
        const objs = await this.createObjects();

        //Album Details
        let albumDet = await Songs.getAlbumByID(albumID);
        albumDet = JSON.parse(JSON.stringify(albumDet[0]));

        // Get Album Songs
        let getTotalSongsFromAlbum = await Songs.getTotalSongsFromAlbum(albumID);
        getTotalSongsFromAlbum = JSON.parse(JSON.stringify(getTotalSongsFromAlbum[0]));
        const totalSongs = getTotalSongsFromAlbum.length;

        getTotalSongsFromAlbum.forEach(song => {
            song.artistName = this.getArtistName(song.artist);
            song.albumName = this.getAlbumName(song.album);
            song.genreName = this.getGenreName(song.genre);
        });

        allDetails.albumDet = albumDet;
        allDetails.artistName = this.artist[albumDet[0].artist];
        allDetails.songsList = getTotalSongsFromAlbum;
        allDetails.totalSongs = totalSongs;

        if (albumDet.length > 0 && this.artist[albumDet[0].artist]) {
            return allDetails;
        } else {
            return false;
        }
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
        return db.execute("SELECT * from songs WHERE id= ?", [id]);
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

    getAllAlbums() {
        return db.execute("SELECT * from albums");
    }

    getAllArtists() {
        return db.execute("SELECT * from artists");
    }

    getAllGenres() {
        return db.execute("SELECT * from genres");
    }
}

module.exports = Songs;
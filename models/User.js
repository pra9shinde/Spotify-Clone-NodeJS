const db = require('../util/database');


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
}

module.exports = User;
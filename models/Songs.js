const db = require('../util/database');

class Songs {
    constructor() {

    }

    static fetchAllAlbums() {
        return db.execute("SELECT * from albums ORDER BY RAND() LIMIT 10");
    }

}

module.exports = Songs;
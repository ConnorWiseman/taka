'use strict';


/**
 * @namespace
 * @property {Object} io  - Socket.IO connection settings.
 * @property {Object} db  - MongoDB connection settings.
 * @property {Object} app - Application-specific settings.
 */
var config = {};


/**
 * @namespace
 * @property {number} port    - The port to listen for incoming websocket connections on.
 * @property {Object} options - An object of Socket.IO connection options.
 */
config.io = {
    port: 1024,
    options: {
        path: '/chat'
    }
};


/**
 * @namespace
 * @property {string} [user]     - The MongoDB user.
 * @property {string} [pass]     - The MongoDB password.
 * @property {string} host       - The MongoDB host.
 * @property {number} port       - The MongoDB port.
 * @property {string} [database] - The MongoDB database.
 * @property {string} URI        - A MongoDB connection URI.
 */
config.db = {
    user: undefined,
    pass: undefined,
    host: '127.0.0.1',
    port: 27017,
    database: 'taka',
    URI: null
};


// Set the connection URI.
config.db.URI = (function(db) {
    var dbURI = 'mongodb://';
    if (typeof db.user !== 'undefined' && db.user !== null) {
        dbURI += db.user + ':' + db.pass + '@';
    }
    dbURI += db.host;
    if (typeof db.port !== 'undefined' && db.port !== null) {
        dbURI += ':' + db.port;
    }
    dbURI += '/';
    if (typeof db.database !== 'undefined' && db.database !== null) {
        dbURI += db.database;
    }
    return dbURI;
}(config.db));


/**
 * @namespace
 * @property {number} messageLimit - The number of messages to load from the database when populating chat history.
 */
config.app = {
    messageLimit: 10
};


module.exports = config;
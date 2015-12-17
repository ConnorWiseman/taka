'use strict';


/**
 * @namespace
 * @property {number} port             - The port number to listen on for incoming Socket.IO connections.
 * @property {Object} options          - An object of Socket.IO connection options.
 * @property {string} options.path     - The path to serve incoming websocket connections on.
 * @property {Object} mongodb          - An object of MongoDB connection properties.
 * @property {string} mongodb.user     - The MongoDB user.
 * @property {string} mongodb.pass     - The MongoDB password.
 * @property {string} mongodb.host     - The MongoDB host.
 * @property {number} mongodb.port     - The MongoDB port.
 * @property {string} mongodb.database - The MongoDB database.
 * @function          mongodb.dbURI    - A utility function that returns a MongoDB connection URI.
 */
var config = module.exports = {
    port: 1024,
    options: {
        path: '/chat'
    },
    mongodb: {
        user: undefined,
        pass: undefined,
        host: '127.0.0.1',
        port: 27017,
        database: undefined,
        dbURI: function() {
            var dbURI = 'mongodb://';


            if (typeof this.user !== 'undefined' && this.user !== null) {
                dbURI += this.user + ':' + this.pass + '@';
            }


            dbURI += this.host;


            if (typeof this.port !== 'undefined' && this.port !== null) {
                dbURI += ':' + this.port;
            }


            dbURI += '/';


            if (typeof this.database !== 'undefined' && this.database !== null) {
                dbURI += this.database;
            }


            return dbURI;
        }
    },
    messageLimit: 10
};
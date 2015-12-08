'use strict';

var config = module.exports = {
    port: 1024,
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
    }
};
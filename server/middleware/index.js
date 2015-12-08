'use strict';


module.exports = function(io) {


    /**
     * @namespace
     * @property {Object} SessionHandler - Session handling middleware.
     * @property {Object} Permissions    - Permision middleware.
     * @property {Object} BanManager     - Ban management middleware.
     * @property {Object} Channels       - Channel middleware.
     * @property {Object} SocketEvents   - Socket event middleware.
     * @readonly
     */
    var Middleware = {
        SessionHandler: require('./session-handler.js'),
        Permissions: require('./permissions.js'),
        BanManager: require('./ban-manager.js'),
        Channels: require('./channels.js'),
        SocketEvents: require('./socket-events.js')(io)
    };

    
    return Middleware;
};
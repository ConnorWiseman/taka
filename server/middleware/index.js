'use strict';

var Middleware = module.exports = function(io) {
    return {
        SessionHandler: require('./session-handler.js'),
        Permissions: require('./permissions.js'),
        BanManager: require('./ban-manager.js'),
        Channels: require('./channels.js'),
        SocketEvents: require('./socket-events.js')(io)
    };
};
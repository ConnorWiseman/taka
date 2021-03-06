'use strict';


var Message = require('../controllers/message-controller.js'),
    OnlineUsers = require('../utilities/online-users.js');


/**
 * Emits initial data to an incoming websocket connection.
 * 
 * @param socket - An object representing the current websocket connection.
 * @param next   - A function that defers execution to the next middleware in the chain.
 * @readonly
 */
module.exports = function(socket, next) {
    if (socket.session.role === 'banned') {
        return next();
    }

    /**
     * Publicly exposed session data.
     * @namespace
     * @property id       - The session id.
     * @property role     - The user role used by the session.
     * @property username - The username associated with the session.
     * @property avatar   - The current user's avatar.
     * @property URL      - The current user's URL.
     * @readonly
     */
    var sessionData = {
        'id':       socket.session.id,
        'role':     socket.session.role,
        'username': socket.session.username,
        'avatar':   socket.session.avatar,
        'URL':      socket.session.URL
    };
    socket.emit('sessionStart', sessionData);


    Message.fetchInitial(socket, function(error, result) {
        if (result.length !== 0) {
            socket.emit('initialMessages', result);
        }


        return next();
    });
};
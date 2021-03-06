'use strict';


var OnlineUsers = require('../utilities/online-users.js');


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


    OnlineUsers.add(socket);


    socket.emit('onlineUsers', OnlineUsers.list());
    socket.broadcast.emit('onlineUsersAdd', {
        username: socket.session.username,
        avatar: socket.session.avatar,
        URL: socket.session.URL,
        instance: socket.id
    });


    return next();
};
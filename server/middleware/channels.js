'use strict';


/**
 * Joins an incoming websocket connection to all necessary rooms.
 * 
 * @param socket - An object representing the current websocket connection.
 * @param next   - A function that defers execution to the next middleware in the chain.
 * @readonly
 */
module.exports = function(socket, next) {
    socket.join(socket.session.username);


    if (socket.can('deleteMessage')) {
        socket.join('staff');
    }
    else {
        socket.join('public');
    }


    return next();
};
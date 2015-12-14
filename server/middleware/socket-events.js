'use strict';


/**
 * Returns a middleware function for attaching event listeners to a socket.
 * 
 * @param io - The global Socket.IO server object.
 * @readonly
 */
module.exports = function(io) {


    /**
     * Attaches event listeners to the current socket.
     * 
     * @param socket - An object representing the current websocket connection.
     * @param next   - A function that defers execution to the next middleware in the chain.
     * @readonly
     */
    return function(socket, next) {
        return next();
    };
};
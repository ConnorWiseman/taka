'use strict';


var address = require('../utilities/ip-address.js');


/**
 * Joins an incoming websocket connection to all necessary rooms.
 * 
 * @param socket - An object representing the current websocket connection.
 * @param next   - A function that defers execution to the next middleware in the chain.
 * @readonly
 */
module.exports = function(socket, next) {
    if (socket.session.role === 'banned') {
        return next();
    }


    socket.join(socket.session.username);
    socket.join(socket.session.ip_address);


    if (socket.isStaff()) {
        socket.join('staff');
    }
    else {
        socket.join('public');
    }


    return next();
};
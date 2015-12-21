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
        socket.on('deleteMessage', function(data) {
            console.log(data);
        });


        socket.on('loadMessages', function() {
            // send messages to client
        });


        for (var i = 0; i <= 15; i++) {
            socket.emit('message', {
                _id: i,
                message: i,
                date: new Date(),
                author: {
                    username: 'TestAuthor',
                    link: 'http://google.com/'
                },
                guestAuthor: 'Testguest'
            });
        };


        return next();
    };
};
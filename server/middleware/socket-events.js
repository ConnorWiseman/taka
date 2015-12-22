'use strict';


var Message = require('../controllers/message-controller.js');


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


        /**
         * Adds a new message to the database, then sends the message to all connected clients.
         * @param {Object} message - A message JSON object.
         * @readonly
         */
        socket.on('sendMessage', function(message) {
            Message.add(socket.session, message, function(error, result) {
                if (error) {
                    console.log(error);
                    return;
                }


                var publicMessage = {
                    'message': result.message,
                    'date': result.date,
                    '_id': result._id
                };

                var staffMessage = {
                    'message': result.message,
                    'date': result.date,
                    '_id': result._id,
                    'ip_address': result.ip_address
                };


                if (typeof result.author !== 'undefined' && result.author !== null) {
                    publicMessage.author = staffMessage.author = result.author;
                }
                else {
                    publicMessage.author = staffMessage.author = {
                        username: result.guestAuthor
                    };
                }


                if (socket.can('viewIP')) {
                    socket.emit('confirmMessage', staffMessage);
                } else {
                    socket.emit('confirmMessage', publicMessage);
                }
                socket.broadcast.to('public').emit('newMessage', publicMessage);
                socket.broadcast.to('staff').emit('newMessage', staffMessage);
            });
        });


        /**
         * Loads additional messages offset by the specified id.
         * @param {string} id - The id to fetch messages from.
         * @readonly
         */
        socket.on('loadMessages', function(id) {
            Message.fetchAdditional(socket, id, function(error, result) {
                if (result.length !== 0) {
                    socket.emit('additionalMessages', result);
                }
            });
        });


        return next();
    };
};
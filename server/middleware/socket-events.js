'use strict';


var Session = require('../controllers/session-controller.js'),
    Ban = require('../controllers/ban-controller.js'),
    User = require('../controllers/user-controller.js'),
    Message = require('../controllers/message-controller.js');


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


        /**
         * Deletes a specified message from the chat history.
         * @param {string} id - The id of a message to delete.
         * @readonly
         */
        socket.on('deleteMessage', function(id) {
            console.log(id);
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


                if (socket.isStaff()) {
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


        /**
         * Binds a specified user to a specified session ID.
         * @param {string} session_id - The session ID to bind to.
         * @param {Object} user       - A user from the database.
         * @readonly
         */
        var bindUserToSession = function(session_id, user) {
            Session.regenerate(session_id, user, function(error, sessionResult) {
                socket.session.user_id = user._id;
                socket.session.id = sessionResult.id;
                socket.session.role = sessionResult.user.role;
                socket.session.username = sessionResult.user.username;


                if (socket.isStaff()) {
                    socket.leave('public');
                    socket.join('staff');
                }


                socket.emit('sessionUpdate', {
                    id:       socket.session.id,
                    role:     socket.session.role,
                    username: socket.session.username
                });
            });
        };


        /**
         * Creates a user with a given set of credentials, then regenerates the session
         * id and updates the local session.
         * @param {object} credentials - An object of user credentials.
         * @readonly
         */
        socket.on('registerUser', function(credentials) {
            console.log(credentials);
            User.register(credentials, function(error, userResult) {
                if (error) {
                    if (error.code === 11000) {
                        // Username is taken.
                    }
                    return;
                }


                return bindUserToSession(socket.session.id, userResult);
            });
        });


        /**
         * Authorizes a user with a given set of credentials, then regenerates the session
         * id and updates the local session.
         * @param {Object} credentials - An object of user credentials.
         * @readonly
         */
        socket.on('signInAttempt', function(credentials) {
            User.authorize(credentials, function(error, userResult) {
                if (error) {
                    // sign in failed
                    return;
                }


                Ban.checkUsername(credentials.username, function(error, banResult) {
                    if (banResult !== null) {
                        socket.emit('banNotice', {
                            reason: banResult.reason,
                            expires: banResult.expires
                        });
                        socket.session.role = 'banned';


                        return;
                    }


                    return bindUserToSession(socket.session.id, userResult);
                })
            });
        });


        return next();
    };
};
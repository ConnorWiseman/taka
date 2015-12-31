'use strict';


var Session = require('../controllers/session-controller.js'),
    Ban = require('../controllers/ban-controller.js'),
    User = require('../controllers/user-controller.js'),
    Message = require('../controllers/message-controller.js'),
    OnlineUsers = require('../utilities/online-users.js');


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
                    publicMessage.author = result.author;
                    staffMessage.author = result.author;
                }
                else {
                    publicMessage.author = staffMessage.author = {
                        username: result.guestAuthor
                    };
                }


                if (socket.isStaff()) {
                    socket.emit('confirmMessage', staffMessage);
                }
                else {
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
         * Binds a specified user to a specified session ID across all connected sockets
         * from the same client.
         * @param {string} session_id - The session ID to bind to.
         * @param {Object} user       - A user from the database.
         * @readonly
         */
        var bindUserToSession = function(session_id, user) {
            Session.regenerate(session_id, user, function(error, sessionResult) {
                var oldName = socket.session.username;


                var socketList = io.sockets.adapter.rooms[oldName];


                for (var socket_id in socketList) {
                    var currentSocket = io.sockets.connected[socket_id];
                    currentSocket.session.id = sessionResult.id;


                    if (!sessionResult.user) {
                        currentSocket.session.user_id = undefined;
                        currentSocket.session.role = 'guest';
                        currentSocket.session.username = Session.guestName(currentSocket.session.id);
                    }
                    else {
                        currentSocket.session.user_id = sessionResult.user._id;
                        currentSocket.session.role = sessionResult.user.role;
                        currentSocket.session.username = sessionResult.user.username;
                    }


                    currentSocket.leave(oldName);
                    currentSocket.join(currentSocket.session.username);


                    if (currentSocket.isStaff()) {
                        currentSocket.leave('public');
                        currentSocket.join('staff');
                    }


                    currentSocket.emit('sessionUpdate', {
                        id:       currentSocket.session.id,
                        role:     currentSocket.session.role,
                        username: currentSocket.session.username
                    });
                }


                OnlineUsers.rename(oldName, currentSocket.session.username);
                io.emit('onlineUsersRename', {
                    oldName: oldName,
                    newName: currentSocket.session.username
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
                    console.log(error);
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


        /**
         * Regenerates the session id and updates the local session.
         * @readonly
         */
        socket.on('signOut', function() {
            return bindUserToSession(socket.session.id, null);
        });


        /**
         * @readonly
         */
        socket.on('updateSettings', function(settings) {
            if (Object.keys(settings).length > 0) {
                User.update(socket.session.username, settings, function(error, result) {
                    var settingsUpdate = {
                        username: socket.session.username
                    };


                    if (typeof settings.URL !== 'undefined' && settings.URL !== '') {
                        settingsUpdate.URL = settings.URL;
                    }


                    if (typeof settings.avatar !== 'undefined' && settings.avatar !== '') {
                        settingsUpdate.avatar = settings.avatar;
                    }


                    io.emit('settingsUpdate', settingsUpdate);
                });
            }
        });


        /**
         * Removes the socket from the online users list when it disconnects.
         * @readonly
         */
        socket.on('disconnect', function() {
            OnlineUsers.remove(socket);
            socket.broadcast.emit('onlineUsersRemove', {
                username: socket.session.username,
                instance: socket.id
            });
        });


        return next();
    };
};
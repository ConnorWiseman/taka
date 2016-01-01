'use strict';


var onlineUsers = {};


/**
 * Adds an entry to the list of online users for the connecting client if none exists.
 * Also adds the socket instance id to the list of connected instances associated with
 * the connecting client.
 * @readonly
 */
exports.add = function(socket) {
    onlineUsers[socket.session.username] = onlineUsers[socket.session.username] || {
        instances: []
    };


    if (typeof socket.session.avatar !== 'undefined') {
        onlineUsers[socket.session.username].avatar = socket.session.avatar;
    }


    if (typeof socket.session.URL !== 'undefined') {
        onlineUsers[socket.session.username].URL = socket.session.URL;
    }


    onlineUsers[socket.session.username].instances.push(socket.id);
};


/**
 * Returns the current list of online users.
 * @readonly
 */
exports.list = function() {
    return onlineUsers;
};


/**
 * Renames a socket instance from the online users list and, if they have no other
 * active connections, deletes the client's entry from the online users list.
 * @readonly
 */
exports.remove = function(socket) {
    if (!onlineUsers[socket.session.username]) {
        return;
    }


    var index = onlineUsers[socket.session.username].instances.indexOf(socket.id);
    if (index !== -1) {
        onlineUsers[socket.session.username].instances.splice(index, 1);
    }


    if (onlineUsers[socket.session.username].instances.length === 0) {
        delete onlineUsers[socket.session.username];
    }
};


/**
 * Renames a client's entry in the online users list when they sign in or out.
 * @readonly
 */
exports.rename = function(oldName, newName) {
    if (oldName === newName) {
        return;
    }


    if (onlineUsers.hasOwnProperty(oldName)) {
        onlineUsers[newName] = onlineUsers[oldName];
        delete onlineUsers[oldName];
    }
};


exports.update = function(username, data) {
    onlineUsers[username].avatar = data.avatar;
    onlineUsers[username].URL = data.URL;
};
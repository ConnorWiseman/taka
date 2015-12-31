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
    console.log(onlineUsers);
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


/*
/**
 * Attaches socket event listeners to the current socket.
 * @arg {object} socket - A Socket.IO socket object.
 * @arg {object} next   - A function to defer execution to the next registered middleware.
 * @readonly

var OnlineList = module.exports = {
    list: {},


    rename: function(oldName, newName) {
        if (oldName === newName) {
            return;
        }

        if (this.list.hasOwnProperty(oldName)) {
            this.list[newName] = this.list[oldName];
            this.list[newName].username = newName;
            delete this.list[oldName];
        }
        console.log(this.list[newName]);
    },

    connectionInstances: function(socket) {
        if (this.list[socket.session.username]) {
            return this.list[socket.session.username].instances;
        }
        return [];
    },

    eachInstance: function(username) {
        for (var i = 0, instanceCount = this.list[username].instances.length; i < instanceCount; i++) {
            console.log(this.list[username].instances[i]);
        }
    },

    clientList: function() {
        var result = {
            userList: []
        };
        for (var user in this.list) {
            if (this.list.hasOwnProperty(user)) {
                var userInfo = {
                    username: this.list[user].username,
                    count: this.list[user].instances.length
                }
                if (this.list[user].icon) {
                    userInfo.icon = this.list[user].icon;
                }
                if (this.list[user].link) {
                    userInfo.link = this.list[user].link;
                }
                result.userList.push(userInfo);
            }
        }
        return result;
    }
};
*/
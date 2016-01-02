'use strict';


/**
 * @namespace
 * @property {object} guest - Guest permissions.
 * @property {object} user  - User permissions.
 * @property {object} mod   - Moderator permissions.
 * @property {object} admin - Administrator permissions.
 * @readonly
 */
var permissions = {
banned: {
    banNotice: true
},
    guest: {
        banNotice: true,
        loadMessages: true,
        registerUser: true,
        sendMessage: true,
        signInAttempt: true
    },
    user: {
        banNotice: true,
        loadMessages: true,
        sendMessage: true,
        signOut: true,
        updateSettings: true
    },
    mod: {
        banNotice: true,
        banUsername: true,
        loadMessages: true,
        deleteMessage: true,
        sendMessage: true,
        signOut: true,
        updateSettings: true,
        viewIP: true
    },
    admin: {
        banNotice: true,
        banUsername: true,
        loadMessages: true,
        deleteMessage: true,
        sendMessage: true,
        signOut: true,
        updateSettings: true,
        viewIP: true
    }
};


/**
 * Maps permissions to user roles, binds utility functions to the current socket object,
 * and overwrites the built-in socket emit and onevent methods to disallow emitting and
 * listening to events from sockets with roles lacking the proper permissions.
 * 
 * @param socket - An object representing the current websocket connection.
 * @param next   - A function that defers execution to the next middleware in the chain.
 * @readonly
 */
module.exports = function(socket, next) {


    /**
     * Determines whether a socket can perform an action based on its role.
     * @param {string} action - An action to check.
     * @returns {boolean} - Whether the socket can perform the specified action.
     * @readonly
     */
    socket.can = function(action) {
        if (typeof permissions[this.session.role] !== 'undefined') {
            return (permissions[this.session.role][action] === true);
        }
        return false;
    };


    /**
     * Determines whether a socket is authorized to perform staff functions.
     * @returns {boolean} - Whether the socket is authorized to perform staff functions.
     * @readonly
     */
    socket.isStaff = function() {
        return (this.session.role === 'mod' || this.session.role === 'admin');
    };


    var onevent = socket.onevent;


    /**
     * Overwrites the built-in onevent method of the socket to ignore events emitted
     * from clients without appropriate permissions.
     * @readonly
     */
    socket.onevent = function(packet) {
        if (this.session.role === 'banned') {
            return;
        }


        if (this.can(arguments[0].data[0])) {
            return onevent.apply(this, arguments);
        }
    };


    return next();
};
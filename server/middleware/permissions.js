'use strict';


var Permissions = {
    banned: {

    },
    guest: {

    },
    user: {

    },
    mod: {

    },
    admin: {

    }
};


module.exports = function(socket, next) {
    socket.can = function(action) {
        if (typeof Permissions[this.session.role] !== 'undefined') {
            return Permissions[this.session.role][action];
        }
        return false;
    };

    socket.isStaff = function() {
        return (socket.session.role === 'admin' || socket.session.role === 'mod');
    };

    var emit = socket.emit;


    socket.emit = function() {
        if (socket.session.role !== 'banned') {
            return emit.apply(socket, arguments);
        }
    };


    var onevent = socket.onevent;


    socket.onevent = function(packet) {
        if (socket.session.role === 'banned') {
            socket.disconnect();
            return;
        }


        if (socket.can(arguments[0].data[0])) {
            return onevent.apply(socket, arguments);
        }
    };


    return next();
};
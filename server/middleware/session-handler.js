'use strict';


var Session = require('../controllers/session-controller.js');


module.exports = function(socket, next) {
    var session_id = socket.handshake.query['taka-sessionid'];


    var ip_address = (socket.request.headers && socket.request.headers['x-forwarded-for'])
        || socket.request.ip 
        || socket.request._remoteAddress 
        || (socket.request.connection && socket.request.connection.remoteAddress);


    socket.session = {
        id:             session_id,
        ip_address:     ip_address,
        message_offset: 0,
        role:           'guest'
    };


    Session.start(session_id, function(error, session) {
        if (error) {
            return next(error);
        }


        socket.emit('session', session);


        return next();
    });
};
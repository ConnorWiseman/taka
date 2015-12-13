'use strict';


var Session = require('../controllers/session-controller.js'),
    Ban = require('../controllers/ban-controller.js');


var address = require('../utilities/ip-address.js');


module.exports = function(socket, next) {
    var session_id = socket.handshake.query['taka-sessionid'];


    var ip_address = address.getFrom(socket.request);


    socket.session = {
        id:             session_id,
        ip_address:     ip_address,
        message_offset: 0,
        role:           'guest'
    };


    Session.start(session_id, function(error, sessionResult) {
        if (error) {
            return next(error);
        }


        socket.session.id = sessionResult._id;
        if (typeof sessionResult.user !== 'undefined' && sessionResult.user !== null) {
            socket.session.role = sessionResult.user.role;
            socket.session.username = sessionResult.user.username;
        }
        else {
            socket.session.username = Session.guestName(sessionResult._id);
        }


        Ban.check(socket, function(error, banResult) {
            if (banResult !== null) {
                // client is banned
            }
            else {
                if (socket.isStaff()) {
                    socket.join('staff');
                }
                else {
                    socket.join('public');
                }


                socket.join(socket.session.username);


                var sessionData = {
                    id:       socket.session.id,
                    role:     socket.session.role,
                    username: socket.session.username
                };


                socket.emit('sessionStart', sessionData);
            }
        });


        return next();
    });
};
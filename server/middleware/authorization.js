'use strict';


var Session = require('../controllers/session-controller.js'),
    Ban = require('../controllers/ban-controller.js');


var address = require('../utilities/ip-address.js');


/**
 * Authorizes an incoming websocket using sessions stored in a database.
 * 
 * @param socket - An object representing the current websocket connection.
 * @param next   - A function that defers execution to the next middleware in the chain.
 * @readonly
 */
module.exports = function(socket, next) {
    var session_id = socket.handshake.query['session_id'],
        ip_address = address.getFrom(socket.request);


    /**
     * The socket's default session values.
     * @namespace
     * @property id             - The session id.
     * @property ip_address     - The IP address associated with the session.
     * @property role           - The user role used by the session.
     * @readonly
     */
    socket.session = {
        id:             session_id,
        ip_address:     ip_address,
        role:           'guest'
    };


    /**
     * Updates the local session with values from the database.
     * @param data - A session record from the database.
     * @readonly
     */
    var updateLocalSession = function(data) {
        socket.session.id = data.id;


        if (typeof data.user !== 'undefined' && data.user !== null) {
            socket.session.user_id = data.user._id;
            socket.session.role = data.user.role;
            socket.session.username = data.user.username;
            socket.session.avatar = data.user.avatar;
            socket.session.URL = data.user.URL;
        }
        else {
            socket.session.username = Session.guestName(data.id);
        }
    };


    // Start the session.
    Session.start(session_id, function(error, result) {
        if (error) {
            return next(error);
        }


        // Update the local session values.
        updateLocalSession(result);


        // Check to see if the connecting user is banned.
        Ban.checkSocket(socket, function(error, result) {
            if (error) {
                return next(error);
            }


            if (result !== null) {
                socket.session.role = 'banned';
                socket.emit('banNotice', {
                    type: (typeof result.username !== 'undefined') ? 'username' : 'ip',
                    reason: result.reason,
                    expires: result.expires
                });
            }


            return next();
        });
    });
};
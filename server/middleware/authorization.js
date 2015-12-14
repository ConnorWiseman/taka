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
     * @property message_offset - 
     * @property role           - The user role used by the session.
     * @readonly
     */
    socket.session = {
        id:             session_id,
        ip_address:     ip_address,
        message_offset: 0,
        role:           'guest'
    };


    /**
     * Updates the local session with values from the database.
     * @param data - A session record from the database.
     * @readonly
     */
    var updateLocalSession = function(data) {
        socket.session.id = data._id;
        if (typeof data.user !== 'undefined' && data.user !== null) {
            socket.session.role = data.user.role;
            socket.session.username = data.user.username;
        }
        else {
            socket.session.username = Session.guestName(data._id);
        }
    };


    /**
     * Refuses the incoming socket connection.
     * @readonly
     */
    var denyIncomingSocket = function() {
        // client is banned
        return next();
    };


    /**
     * Joins the socket to all necessary rooms.
     * @readonly
     */
    var joinRooms = function() {
        socket.join(socket.session.username);
        if (socket.isStaff()) {
            socket.join('staff');
        }
        else {
            socket.join('public');
        }
    };


    /**
     * Emits session data to the connecting socket.
     * @readonly
     */
    var emitSessionData = function() {


        /**
         * Publicly exposed session data.
         * @namespace
         * @property id       - The session id.
         * @property role     - The user role used by the session.
         * @property username - The username associated with the session.
         * @readonly
         */
        var sessionData = {
            id:       socket.session.id,
            role:     socket.session.role,
            username: socket.session.username
        };
        socket.emit('sessionStart', sessionData);
    };


    Session.start(session_id, function(error, result) {
        if (error) {
            return next(error);
        }
        updateLocalSession(result);


        Ban.check(socket, function(error, result) {
            if (error) {
                return next(error);
            }


            if (result !== null) {
                return denyIncomingSocket();
            }


            joinRooms();
            emitSessionData();


            return next();
        });
    });
};
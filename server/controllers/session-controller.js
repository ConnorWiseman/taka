'use strict';


var mongoose = require('mongoose'),
    uuid = require('node-uuid'),
    validator = require('validator');


var SessionModel = mongoose.model('Session');


/**
 * A traditional Node.js "errorback" function.
 * @callback nodeCallback
 */
 

/**
 * Updates a specified session, then executes a specified callback.
 * @param {Object} query            - A Mongoose query statement object.
 * @param {Object} update           - A Mongoose update statement object.
 * @param {Object} options          - A Mongoose options object.
 * @param {nodeCallback} callback   - A callback function to execute.
 * @readonly
 */
var updateSession = function(query, update, options, callback) {
    SessionModel.findOneAndUpdate(query, update, options).populate('user').lean().exec(function(error, session) {
        if (error) {
            if (callback && typeof callback === 'function') {
                return callback(error);
            }
        }

        if (callback && typeof callback === 'function') {
            return callback(null, session);
        }
    });
};


/**
 * Finds or creates a session if it does not exist, updates the expiration (last accessed)
 * date, and executes a given callback with the updated session information.
 * @param {string} session_id       - The session id to update.
 * @param {nodeCallback} callback   - A callback function to execute.
 * @readonly
 */
exports.start = function(session_id, callback) {
    if (!validator.isUUID(session_id, 4)) {
        session_id = uuid.v4();
    }


    var query = {
        id: String(session_id)
    };


    var update = {
        expires: new Date()
    };


    var options = {
        new: true,
        upsert: true
    };


    return updateSession(query, update, options, callback);
};


/**
 * Creates a new session from a given session, binding user information to the new
 * session as appropriate. Executes a given callback with the updaed session information.
 * @param {string} session_id       - The local socket session object.
 * @param {Object} user             - A document representing a user to bind to this session.
 *                                    Set null to log the session out.
 * @param {nodeCallback} callback   - A callback function to execute.
 * @readonly
 */
exports.regenerate = function(session_id, user, callback) {
    var query = {
        id: String(session_id)
    };


    var update = {
        id: uuid.v4(),
        expires: new Date()
    };


    var options = {
        new: true
    };


    if (user) {
        update.user = user._id;
        update.upsert = true;
    }
    else {
        update.user = undefined;
    }


    return updateSession(query, update, options, callback);
};


/**
 * Generates a guest name from the provided session id.
 * @param {string} session_id - A session id.
 * @returns {string} - A guest name generated from the socket session object.
 * @readonly
 */
exports.guestName = function(session_id) {
    var value = parseInt(session_id.slice(-5), 16) % 100000;
    return 'Guest' + value;
};
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
        _id: String(session_id)
    };

    var update = {
        expires: new Date()
    };

    var options = {
        new: true,
        upsert: true
    };

    return updateSession(query, update, options, callback);
}
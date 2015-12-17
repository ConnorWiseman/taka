'use strict';


var mongoose = require('mongoose'),
    config = require('../config.js');


var MessageModel = mongoose.model('Message');


/**
 * A traditional Node.js "errorback" function.
 * @callback nodeCallback
 */


/**
 * Fetches a subset of messages from the database.
 * @param {Object} query            - A Mongoose query object.
 * @param {Object} socket           - A Socket.IO socket object.
 * @param {nodeCallback} callback   - A callback function to execute.
 * @readonly
 */
var fetchMessages = function(query, socket, callback) {
    if (socket.isStaff()) {
        query.select('-ip');
    }


    query.sort({
        _id: 'descending'
    });
    query.populate('author', '-password');
    query.limit(config.messageLimit);


    query.exec(function(error, result) {
        if (error) {
            return callback(error);
        }


        return callback(null, result);
    });
};


/**
 * Searches the database for a matching ban record for the given session.
 * @param {Object} socket           - A socket object.
 * @param {nodeCallback} callback   - A callback function to execute.
 * @readonly
 */
exports.fetchInitial = function(socket, callback) {
    var query = MessageModel.find( { deleted: { $ne: true } } );


    return fetchMessages(query, socket, callback);
};


/**
 * Searches the database for a matching ban record for the given session.
 * @param {Object} socket           - A socket object.
 * @param {nodeCallback} callback   - A callback function to execute.
 * @readonly
 */
exports.fetchAdditional = function(socket, lastId, callback) {
    var query = MessageModel.find({$and: [
        { deleted: { $ne: true } },
        { _id: { $gt: lastId } }
    ]});


    return fetchMessages(query, socket, callback);
};
'use strict';


var mongoose = require('mongoose'),
    config = require('../config.js'),
    address = require('../utilities/ip-address.js');


var MessageModel = mongoose.model('Message');


/**
 * A traditional Node.js "errorback" function.
 * @callback nodeCallback
 */
 
 
/**
 * Adds a new message to the database, then executes a given callback with the
 * new message information.
 * @param {Object} session          - The local socket session object.
 * @param {string} message          - The message's contents.
 * @param {nodeCallback} callback   - A callback function to execute.
 * @readonly
 */
exports.add = function(session, message, callback) {
    var newMessage = new MessageModel();


    if (session.user_id) {
        newMessage.author = session.user_id;
    }
    else {
        newMessage.guestAuthor = session.username;
    }
    newMessage.message = message;
    newMessage.ip_address = address.toInt(session.ip_address);
    newMessage.channel = message.channel;


    newMessage.save(function(error) {
        if (error) {
            return callback(error);
        }


        if (session.user_id) {
            return newMessage.populate('author', '-password', function(error) {
                return callback(null, newMessage);
            });
        }


        return callback(null, newMessage);
    });
};


/**
 * Fetches a subset of messages from the database.
 * @param {Object} query            - A Mongoose query object.
 * @param {Object} socket           - A Socket.IO socket object.
 * @param {nodeCallback} callback   - A callback function to execute.
 * @readonly
 */
var fetchMessages = function(query, socket, callback) {
    if (!socket.can('viewIP')) {
        query.select('-ip_address');
    }


    query.sort({
        _id: 'descending'
    });
    query.populate('author', '-password');
    query.limit(config.app.messageLimit);


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
        { _id: { $lt: lastId } }
    ]});


    return fetchMessages(query, socket, callback);
};


/**
 *
 */
exports.delete = function(message_id, callback) {
    MessageModel.update({
        _id: message_id
    }, {
        deleted: true
    }).exec(function(error, result) {
        if (error) {
            return callback(error);
        }


        return callback(null, result);
    });
};


/**
 *
 */
exports.deleteAll = function(callback) {
    MessageModel.update({
        deleted: false
    }, {
        deleted: true
    }, {
        multi: true
    }).exec(function(error, result) {
        if (error) {
            return callback(error);
        }


        return callback(null, result);
    });
};
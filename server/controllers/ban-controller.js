'use strict';


var mongoose = require('mongoose'),
    address = require('../utilities/ip-address.js'),
    guestName = require('../utilities/guest-name.js');


var User = require('./user-controller.js');


var BanModel = mongoose.model('Ban');


/**
 * A traditional Node.js "errorback" function.
 * @callback nodeCallback
 */


/**
 * Searches the database for a matching ban record for the given username.
 * @param {Object} query            - A Mongoose query object.
 * @param {nodeCallback} callback   - A callback function to execute.
 * @readonly
 */
var checkForBan = function(query, callback) {
    BanModel.findOne(query, function (error, result) { 
        if (error) {
            return callback(error);
        }


        return callback(null, result);
    });
};


/**
 * Adds a ban record to the database.
 * @param {Object} query          - A Mongoose query object.
 * @param {number} [duration]     - The duration of the ban, in seconds.
 * @param {string} [reason]       - The reason for the ban.
 * @param {nodeCallback} callback - A callback function to execute.
 * @readonly
 */
var insertBanRecord = function(query, duration, reason, callback) {
    if (typeof duration === 'undefined') {
        duration = 30;
    }


    if (typeof reason === 'undefined') {
        reason = 'No reason given';
    }


    var expirationDate = new Date();
    expirationDate.setSeconds(expirationDate.getSeconds() + (duration - 60));


    var update = {
        expires: expirationDate,
        reason: reason
    };


    var options = {
        new: true,
        upsert: true
    };


    BanModel.findOneAndUpdate(query, update, options).lean().exec(function(error, result) {
        if (error) {
            return callback(error);
        }


        return callback(null, result);
    });
};


/**
 * Adds a new ban record for the specified username to the database,
 * then executes a given callback.
 * @param {string} username       - A username to ban.
 * @param {number} [duration]     - The duration of the ban, in seconds.
 * @param {string} [reason]       - The reason for the ban.
 * @param {nodeCallback} callback - A callback function to execute.
 * @readonly
 */
exports.username = function(username, duration, reason, callback) {
    if (guestName.check(username)) {
        return callback('Cannot ban guests by username.');
    }
    
    User.exists(username, function(error, result) {
        if (result.role === 'admin') {
            return callback('Cannot ban chat administrators.');
        }


        var query = {
            username: username
        };


        return insertBanRecord(query, duration, reason, callback);
    });
};


/**
 * Adds a new ban record for the specified IP address to the database,
 * then executes a given callback.
 * @param {string} ip_address     - An IP address.
 * @param {number} [duration]     - The duration of the ban, in seconds.
 * @param {string} [reason]       - The reason for the ban.
 * @param {nodeCallback} callback - A callback function to execute.
 * @readonly
 */
exports.IP = function(ip_address, duration, reason, callback) {
    if (address.isValid(ip_address)) {
        ip_address =  address.toInt(ip_address)
    }


    var query = {
        ip_address: ip_address
    };


    return insertBanRecord(query, duration, reason, callback);
};


/**
 * Searches the database for a matching ban record for the given username.
 * @param {string} username         - A username.
 * @param {nodeCallback} callback   - A callback function to execute.
 * @readonly
 */
exports.checkUsername = function(username, callback) {
    var query = {
        username: username
    };

    
    return checkForBan(query, callback);
};


/**
 * Searches the database for a matching ban record for the given IP address.
 * @param {string} ip_address       - An IP address in IPv4 format.
 * @param {nodeCallback} callback   - A callback function to execute.
 * @readonly
 */
exports.checkIP = function(ip_address, callback) {
    var query = {
        ip_address: address.toInt(ip_address)
    };


    return checkForBan(query, callback);
};


/**
 * Searches the database for a matching ban record for the given session.
 * @param {Object} socket           - A socket object.
 * @param {nodeCallback} callback   - A callback function to execute.
 * @readonly
 */
exports.checkSocket = function(socket, callback) {
    var query = {
        $or:[
            { username: socket.session.username },
            { ip_address: address.toInt(socket.session.ip_address) }
        ]
    };


    return checkForBan(query, callback);
};
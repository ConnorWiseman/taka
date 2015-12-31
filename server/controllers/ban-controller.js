'use strict';


var mongoose = require('mongoose'),
    address = require('../utilities/ip-address.js');


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
        ip: address.toInt(ip_address)
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
            { ip: address.toInt(socket.session.ip_address) }
        ]
    };


    return checkForBan(query, callback);
};
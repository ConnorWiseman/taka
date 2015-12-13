'use strict';


var mongoose = require('mongoose'),
    address = require('../utilities/ip-address.js');


var BanModel = mongoose.model('Ban');


/**
 * A traditional Node.js "errorback" function.
 * @callback nodeCallback
 */


/**
 * Searches the database for a matching ban record for the given session.
 * @param {Object} socket           - A socket object.
 * @param {nodeCallback} callback   - A callback function to execute.
 * @readonly
 */
exports.check = function(socket, callback) {
    var query = {
        $or:[
            { username: socket.session.username },
            { ip: address.toInt(socket.session.ip_address) }
        ]
    };


    BanModel.findOne(query, function (error, result) { 
        if (error) {
            return callback(error);
        }
        return callback(null, result);
    });
};
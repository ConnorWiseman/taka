'use strict';


var mongoose = require('mongoose'),
    crypto = require('crypto'),
    validator = require('validator');


var UserModel = mongoose.model('User');


/**
 * A traditional Node.js "errorback" function.
 * @callback nodeCallback
 */


/**
 * Creates a new user with the given credentials, then Executes a given callback
 * with the new user information.
 * @arg {object} credentials        - An object containing a username/password pair.
 * @param {nodeCallback} callback   - A callback function to execute.
 * @readonly
 */
exports.register = function(credentials, callback) {
    var user = new UserModel();


    user.username = String(credentials.username);
    user.password = crypto.createHash('sha256').update(String(credentials.password)).digest('hex');


    user.save(function(error) {
        if (error) {
            return callback(error);
        }


        return callback(null, user);
    });
};
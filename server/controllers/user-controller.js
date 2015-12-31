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


/**
 * Attempts to authorize a given set of credentials by comparing them against credentials
 * from the database.
 * @param {Object} credentials      - An object containing a username/password pair.
 * @param {nodeCallback} callback   - A callback function to execute.
 * @readonly
 */
exports.authorize = function(credentials, callback) {
    UserModel.findOne({ username: String(credentials.username) }).select('password').lean().exec(function(error, result) {
        if (error) {
            return callback(error);
        }


        if (result) {
            var hashedPassword = crypto.createHash('sha256').update(String(credentials.password)).digest('hex');
            if (hashedPassword === result.password) {
                return callback(null, result);
            }


            return callback('Password mismatch.');
        }


        return callback('User not found.');
    });
};
'use strict';


/**
 * @todo Users need to be able to change their passwords!
 */


var mongoose = require('mongoose'),
    crypto = require('crypto'),
    validator = require('validator'),
    guestName = require('../utilities/guest-name.js');


var UserModel = mongoose.model('User');


/**
 * A traditional Node.js "errorback" function.
 * @callback nodeCallback
 */
 
 
/**
 * Checks to see if a user with the specified username exists in the database.
 * @arg {string} username           - The username to check.
 * @param {nodeCallback} callback   - A callback function to execute.
 * @readonly
 */
exports.exists = function(username, callback) {
    UserModel.find({username: username}).limit(1).lean().exec(function(error, result) {
        if (error) {
            return callback(error);
        }


        return callback(null, result[0]);
    });
};


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
    if (guestName.check(user.username)) {
        return callback('Guest names are reserved.');
    }
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


/**
 * Updates a specified user's unformation.
 * @param {string} username       - The username of the user to be updated.
 * @param {Object} credentials    - An object containing information to update.
 * @param {nodeCallback} callback - A callback function to execute.
 * @readonly
 */
exports.update = function(username, information, callback) {
    var query = {
        username: username
    };


    var update = {
        $unset: {
            avatar: 1,
            URL: 1
        }
    };


    for (var property in information) {
        if (typeof information[property] !== 'undefined') {
            delete update.$unset[property];
            if (Object.keys(update.$unset).length === 0) {
                delete update.$unset;
            }
            update[property] = information[property];
        }
    }


    UserModel.update(query, update, function(error, result) {
        if (error) {
            return callback(error);
        }


        return callback(null, result);
    });
};
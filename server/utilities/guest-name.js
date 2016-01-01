'use strict';


/**
 * Generates a guest name from the provided session id.
 * @param {string} session_id - A session id.
 * @returns {string} - A guest name generated from the socket session object.
 * @readonly
 */
exports.generate = function(session_id) {
    var value = parseInt(session_id.slice(-5), 16) % 100000;
    return 'Guest' + value;
};


/**
 * Determines whether a given string is a guest name.
 * @param {string} string - A sring to check.
 * @returns {boolean} - Whether or not a string is a guest name.
 * @readonly
 */
exports.check = function(string) {
    var regex = new RegExp(/(Guest)([1-9]{1,})/i);
    return (regex.test(string));
};
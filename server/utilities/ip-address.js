'use strict';


var Address4 = require('ip-address').Address4;


/**
 * Gets the user's IPv4 address from a given socket request.
 * @param {object} request - A socket request object.
 * @returns {string} - An IPv4 address.
 * @readonly
 */
exports.getFrom = function(request) {
    return (request.headers && request.headers['x-forwarded-for'])
            || request.ip 
            || request._remoteAddress 
            || (request.connection && request.connection.remoteAddress);
}


/**
 * Converts an IPv4 address string to an integer.
 * @param {string} address - An IPv4 address in string form.
 * @returns {number} - An IPv4 address in numeric form.
 * @readonly
 */
exports.toInt = function(address) {
    var octets = address.split('.'),
        result = 0;

    result += (Number(octets[0], 10) << 24) >>> 0;
    result += (Number(octets[1], 10) << 16) >>> 0;
    result += (Number(octets[2], 10) << 8) >>> 0;
    result += Number(octets[3], 10) >>> 0;

    return result;
};


/**
 * Converts an integer to an IPv4 address string.
 * @param {number} number - An IPv4 address in numeric form.
 * @returns {string} - An IPv4 address in string form.
 * @readonly
 */
exports.fromInt = function(number) {
    var octet1 = ((number >> 24) & 255),
        octet2 = ((number >> 16) & 255),
        octet3 = ((number >> 8) & 255),
        octet4 = (number & 255);

    return (octet1 + '.' + octet2 + '.' + octet3 + '.' + octet4);
};


/**
 * Validates a given IPv4 address.
 * @param {string} string - An IPv4 address to validate.
 * @returns {boolean} - Whether or not a string is a valid IPv4 address.
 * @readonly
 */
exports.isValid = function(string) {
    return new Address4(string).isValid();
}
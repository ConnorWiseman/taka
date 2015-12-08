'use strict';

module.exports = function(io) {
    return function(socket, next) {
        return next();
    };
};
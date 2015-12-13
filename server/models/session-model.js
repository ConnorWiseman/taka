'use strict';


var mongoose = require('mongoose'),
    uuid = require('node-uuid');


/**
 * @namespace
 * @property {string} _id     - The session's id.
 * @property {Object} user    - A reference to a user in the database.
 * @property {Object} expires - A date object representing an expiration date. 
 * @readonly
 */
var sessionSchemaFields = {
    _id: {
        default: uuid.v4,
        required: true,
        type: String,
        unique: true
    },
    user: {
        ref: 'User',
        sparse: true,
        type: mongoose.Schema.Types.ObjectId
    },
    expires: {
        default: new Date,
        index: {
            expires: 172800
        },
        required: true,
        select: false,
        type: Date
    }
};


/**
 * @namespace
 * @property {string} versionKey - Whether or not to enable document versioning.
 * @readonly
 */
var schemaOptions = {
    versionKey: false
};


var sessionSchema = new mongoose.Schema(sessionSchemaFields, schemaOptions);


module.exports = mongoose.model('Session', sessionSchema);
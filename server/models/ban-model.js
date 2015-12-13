'use strict';


var mongoose = require('mongoose');


/**
 * The Mongoose schema definition for ban records.
 * @property {string} username - The username to be banned. Optional.
 * @property {number} ip       - The ip address to be banned. Optional.
 * @property {string} reason   - The reason for this ban.
 * @property {Object} expires  - The date when this ban expires.
 * @readonly
 */
 var banSchemaFields = {
    username: {
        maxlength: 32,
        sparse: true,
        type: String,
        unique: true
    },
    ip: {
        sparse: true,
        type: Number,
        unique: true
    },
    reason: {
        maxlength: 255,
        sparse: true,
        type: String
    },
    expires: {
        index: {
            expireAfterSeconds: 0
        },
        required: true,
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


var banSchema = new mongoose.Schema(banSchemaFields, schemaOptions);


module.exports = mongoose.model('Ban', banSchema);
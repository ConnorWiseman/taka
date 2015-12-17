'use strict';


var mongoose = require('mongoose');


/**
 * The Mongoose schema definition for ban records.
 * @param {Object}  [author]       - Embedded author information.
 * @param {Object}  [guestAuthor]  - The name of the guest who authored this message.
 * @param {Object}  date           - The date of message submission.
 * @param {string}  content        - The message's content.
 * @param {number}  ip             - A numeric representation of an IPv4 address.
 * @param {boolean} deleted        - Whether the message was deleted or not.
 * @readonly
 */
 var messageSchemaFields = {
    author: {
        ref: 'User',
        sparse: true,
        type: mongoose.Schema.Types.ObjectId
    },
    guestAuthor: {
        maxlength: 32,
        sparse: true,
        type: String
    },
    date: {
        default: Date.now,
        required: true,
        type: Date
    },
    content: {
        maxlength: 255,
        required: true,
        type: String
    },
    ip: {
        required: true,
        type: Number
    },
    deleted: {
        default: false,
        required: true,
        select: false,
        type: Boolean
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


/**
 * @namespace
 * @property {Object} capped      - Capped collection settings.
 * @property {number} capped.size - Capped collection settings.
 * @property {number} capped.max  - Capped collection settings.
 * @readonly
 */
var collectionOptions = {
    capped: {
        size: 1048576,
        max: 500
    }
};


var messageSchema = new mongoose.Schema(messageSchemaFields, schemaOptions, collectionOptions);


module.exports = mongoose.model('Message', messageSchema);
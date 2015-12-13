'use strict';


var mongoose = require('mongoose');


/**
 * @namespace
 * @property {string} username - This user's username.
 * @property {string} password - A SHA256 hash of this user's password.
 * @property {string} avatar   - A user-specified image URL.
 * @property {string} link     - A user-specified URL.
 * @property {string} role     - This user's role.
 * @readonly
 */
 var userSchemaFields = {
    username: {
        maxlength: 32,
        required: true,
        type: String,
        unique: true
    },
    password: {
        maxlength: 64,
        minlength: 64,
        required: true,
        select: false,
        type: String
    },
    avatar: {
        maxlength: 255,
        sparse: true,
        type: String
    },
    link: {
        maxlength: 255,
        sparse: true,
        type: String
    },
    role: {
        default: 'user',
        required: true,
        type: String
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


var userSchema = new mongoose.Schema(userSchemaFields, schemaOptions);


module.exports = mongoose.model('User', userSchema);
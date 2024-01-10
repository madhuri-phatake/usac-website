const mongoose = require('mongoose');
// const mongodberror=require("mongoose-mongodb-errors");
require('../mongo');

const User_Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    mobile_number: {
        type: String,
        required: true,
        trim: true,
        index: true,
        index: {
            unique: true
        }
    },
    email_id: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        trim: true,
        default: null
    },
    address: {
        type: String,
        trim: true
    },
    user_status: {
        type: String,
        trim: true,
        required: true,
        default: 'Inactive'
    },
    user_type: {
        type: String,
        trim: true,
        required: true,
        default: 'Admin'
    },
    user_access: {
        type: Array,
        required: true,
    },
    created_by: {
        type: mongoose.Schema.ObjectId,
        ref: 'users',
        default: null,
        index: true
    }
},{
    timestamps: true
})
var UserModel = mongoose.model('users', User_Schema);
module.exports = UserModel;
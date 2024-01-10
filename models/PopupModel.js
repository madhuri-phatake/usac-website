const mongoose = require('mongoose');
require('../mongo');

const popup_Schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    
    from_date: {
        type: Date,
        required: true
    },
    to_date: {
        type: Date,
        required: true
    },
    description: {
        type:  String,
        default: null
    },
    cta_url: {
        type:  String,
        default: null
    },
    image: {
        type: [],
        trim: true,
        default: null
    },
    
    click_count: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        default: false
    },
    timeout_duration: {
        type: Number,
        default: 1
    },

},{
    timestamps: true
})
var PopupModel = mongoose.model('adbanao_popups', popup_Schema);
module.exports = PopupModel;
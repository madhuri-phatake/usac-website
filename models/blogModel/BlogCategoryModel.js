const mongoose = require('mongoose');
require('../../mongo');

const blog_categories_Schema = new mongoose.Schema({
    name :{
        type: String,
        trim: true,
        required: true
    },
    icon :{
        type: String,
        trim: true,
        required: true
    },
    priority: {
        type: Number,
        trim: true,
        default:null
    },
    status: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true
})
var BlogCategoryModel = mongoose.model('adbanaoBlogCat', blog_categories_Schema);
module.exports = BlogCategoryModel;
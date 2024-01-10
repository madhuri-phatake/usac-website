const mongoose = require('mongoose');
require('../../mongo');

const blog_Schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    unique_url: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    description: {
        type:  String,
        default: null
    },
    link: {
        type: String,
        trim: true,
        default: null
    },
    image: {
        type: [],
        trim: true,
        default: null
    },
    thumbnail_image: {
        type: [],
        trim: true,
        default: null
    },
    priority: {
        type: Number,
        default: 1
    },
    is_active: {
        type: Boolean,
        default: true
    },
    category_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'blog_categories',
        default: null,
        index: true
    },
    detail_description: {
        type:  String,
        default: null
    },
    blog_meta_tags: {
        type:  String,
        default: null
    },
    blog_related_cat_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'category',
        default: null,
    },
    blog_related_sub_cat_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'sub_category',
        default: null,
    },
    meta_title:{
        type:  String,
        default: null
    },
    meta_dec:{
        type:  String,
        default: null
    },
    blog_related_product_id: {
        type: [mongoose.Types.ObjectId],
        default: []
    },


},{
    timestamps: true
})
var BlogModel = mongoose.model('adbanaoBlogs', blog_Schema);
module.exports = BlogModel;
var express                 = require('express');
var router                  = express.Router();
// const CategoryModel         = require("../models/CategoryModel.js");
// const BannerModel           = require("../models/website/BannerModel");
// const DeliveryChargesModel  = require("../models/DeliveryChargesModel");
// const BottomBannerModel     = require("../models/website/MarkettingBannersModel");
// const SubCategoryModel      = require("../models/SubCategoryModel.js");
// const SubCategoryModel2     = require("../models/SubcategoryModel2");
// const TopicMasterModel      = require("../models/TopicMasterModel");
const cron                  = require("node-cron");
const redisConfig           = require("../config/redisConfig");
const fs                    = require('fs');
const multer                = require('multer');
const readXlsxFile          = require('read-excel-file/node');
const mongoose              = require('mongoose');
const redis_time            = (60 * 30);

//Store the files in local folder
const storage               = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/admin/category')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
    }
});

const upload = multer({
    storage: storage
});

const storage1 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/admin/subcategory')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
    }
});

const upload1 = multer({
    storage: storage1
});

const storage2 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/admin/subcategory')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
    }
});

const upload2 = multer({
    storage: storage2
});

let response = {
    status: 200,
    title: null,
    message: null
};



//Sub Category


//--------------Created by Rupali-----------------------------------//
//--------------Get gift card categories------------//



//------------End Created by Rupali----------------------------------//





















































module.exports = router;
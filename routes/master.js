var express = require('express');
var router = express.Router();
const Cryptr = require('cryptr');
const cryptr = new Cryptr("10");
const url = require('url');
const fs = require('fs');
var pdf = require('html-pdf');
const multer = require('multer');
const axios = require("axios");

// const TagsModel = require("../models/TagsModel");
const msg91 = require("msg91")("319966AWb3Z1Vvye5e53db71P1", "LWMADM", "4");
const readXlsxFile = require('read-excel-file/node');
// const OrderModel   = require("../models/OrderDetailModel");
const mongoose     = require("mongoose");
const moment        = require("moment");

let response = {
  status: 200,
  success: true,
  title: null,
  message: null
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'public/uploads/vendor_pincodes')
  },
  filename: (req, file, cb) => {
      cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
  }
});

const upload = multer({
  storage: storage
});

//Serviceable pinocde 
const storage1 = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'public/uploads/serviceable_pincodes')
  },
  filename: (req, file, cb) => {
      cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
  }
});

const upload1 = multer({
  storage: storage1
});

//XB Serviceable pinocde 
const storage2 = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'public/uploads/xb_serviceable_pincodes')
  },
  filename: (req, file, cb) => {
      cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
  }
});

const upload2 = multer({
  storage: storage2
});




module.exports = router;
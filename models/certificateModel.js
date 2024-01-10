const mongoose = require("mongoose");
require("../mongo");

const Certificate_Schema = new mongoose.Schema(
  {
    certificationtitle: {
      type: String,
      required: true
    },
    certificationaddress: {
      type: String,
      required: true
    },
    certificationscope: {
      type: Array,
      required: true
    },
    certificationregistration: {
      type: Date,
      required: true
    },
    certificationexpiry: {
      type: Date,
      default: null
    },
    is_active: {
      type: String,
      default: false
    }
  },
  {
    timestamps: true
  }
);
var CertificateSchema = mongoose.model(
  "Certificate_Schema_usac",
  Certificate_Schema
);
module.exports = CertificateSchema;

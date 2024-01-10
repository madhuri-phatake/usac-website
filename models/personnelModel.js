const mongoose = require("mongoose");
require("../mongo");

const Personnel_Schema = new mongoose.Schema(
  {
    personnel_name: {
      type: String,
      required: true
    },
    personnel_course: {
      type: String,
      required: true
    },
    personnel_registration: {
      type: Date,
      required: true
    },
    personnel_country: {
      type: String,
      required: true
    },
    personnel_photo: {
      type: String
    },
    personnel_certificate_no: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);
var PersonnelSchema = mongoose.model("Personnel_Schema_usac", Personnel_Schema);
module.exports = PersonnelSchema;

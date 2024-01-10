const mongoose = require("mongoose");
require("../mongo");

const Home_Page_Schema = new mongoose.Schema(
  {
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
      default: null
    },
    cta_url: {
      type: String,
      default: null
    },
    image: {
      type: [],
      trim: true,
      default: null
    },

    status: {
      type: String,
      default: false
    },
    priority: {
      type: Number,
      required: true
    },
    click_count: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);
var HomePageModel = mongoose.model(
  "adbanao_home_page_slider",
  Home_Page_Schema
);
module.exports = HomePageModel;

require("dotenv").config();
const mongoose = require("mongoose");
const HomeModel = require("../models/HomePageModel");

const axios = require("axios");
const ObjectId = mongoose.Types.ObjectId;

let response = {
  status: true,
  message: "",
  data: {},
};

//Create popup
exports.create_home_slider = (req, res, next) => {
  // If _id is null it will save popup otherwsie update popup
  if (req.body._id === null || req.body._id === "null") {
    save_home_slider(req, res, next);
  } else {
    update_home_slider(req, res, next);
  }
};

async function save_home_slider(req, res, next) {
  const response = {}; 
  


  const newData = new HomeModel({
    title: req.body.title,
    from_date: req.body.from_date,
    to_date: req.body.to_date,
    description: req.body.description,
    image: req.body.image,
    cta_url: req.body.cta_url,
    click_count: req.body.click_count,
    timeout_duration: req.body.timeout_duration,
    status: req.body.status,
    priority: req.body.priority
  });

  try {
    const info = await newData.save();
    response.title = "success";
    response.status = true;
    response.data = info;
    response.message = "Popup added successfully";
    return res.json(response);
  } catch (saveError) {
    response.title = "error";
    response.status = false;
    response.data = saveError;
    response.message = "Something Went Wrong!";
    return res.json(response);
  }
}

//Function to update the Popup
async function update_home_slider(req, res, next) {
  var updateData = {};
 
  for (var field in req.body) {
    updateData[field] = req.body[field];
  }

  //Update the details of the Popup in database
  HomeModel.findOneAndUpdate(
    { _id: req.body._id },
    { $set: updateData },
    { new: true },
    
  )
    .exec()
    .then((info) => {
      response.title = "success";
      response.status = true;
      response.data = info;
      response.message = "Popup updated successfully!";
      return res.json(response);
    })
    .catch((err) => {
      response.title = "error";
      response.status = false;
      response.data = err;
      response.message = "Something Went Wrong!";
      return res.json(response);
      next(err);
    });
}



//API to get all the Popup
exports.get_all_home_slider = (req, res, next) => {
    HomeModel.find()
  .sort({_id: -1})
  .exec()
  .then((result) => {
    response.title = "success";
    response.status = true;
    response.data = result;
    response.message = "Slider displayed successfully!!";
    return res.json(response);
  })
  .catch((err) => {
    response.title = "error";
    response.status = false;
    response.data = [];
    response.message = "Something Went Wrong!";
    return res.json(response);
    next(err);
  });
};

//--------Get Active Home page---------//
exports.get_active_home_slider = (req, res, next) => {
  HomeModel.find({status:"active"})
  .sort({priority:1})
.exec()
.then((result) => {
  response.title = "success";
  response.status = true;
  response.data = result;
  response.message = "Active Slider displayed successfully!!";
  return res.json(response);
})
.catch((err) => {
  response.title = "error";
  response.status = false;
  response.data = [];
  response.message = "Something Went Wrong!";
  return res.json(response);
  next(err);
});
};
//API to delete the Popup
exports.delete_home_slider = (req, res) => {
    HomeModel.findOneAndDelete({ _id: req.params.home_slider_id })
    .exec()
    .then((info) => {
      response.title = "success";
      response.status = true;
      response.data = info;
      response.message = "Slider deleted successfully";
      return res.json(response);
    })
    .catch((err) => {
      response.title = "error";
      response.status = false;
      response.data = err;
      response.message = "Something Went Wrong!";
      return res.json(response);
    });
};


exports.increase_count = async (req, res, next) => {
  const event_id = req.body.event_id; // Use "event_id" here


  HomeModel.findOneAndUpdate(
    { _id: event_id },
    { $inc: { click_count: 1 } },
    { new: true }
  )
    .exec()
    .then((result) => {
      if (!result) {
        return res.status(404).json({
          status: false,
          message: "Event not found in the database.",
          title: "error",
        });
      }

      return res.status(200).json({
        status: true,
        message: "Count Updated Successfully!",
        title: "success",
      });
    })
    .catch((err) => {
      console.error(err); // Log the error for debugging
      return res.status(500).json({
        status: false,
        message: "Something went wrong!",
        title: "error",
      });
    });
};


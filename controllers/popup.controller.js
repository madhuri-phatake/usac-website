require("dotenv").config();
const mongoose = require("mongoose");
const PopupModel = require("../models/PopupModel");

const axios = require("axios");
const ObjectId = mongoose.Types.ObjectId;

let response = {
  status: true,
  message: "",
  data: {},
};

//Create popup
exports.create_popup = (req, res, next) => {
  // If _id is null it will save popup otherwsie update popup
  if (req.body._id === null || req.body._id === "null") {
    save_popup(req, res, next);
  } else {
    update_popup(req, res, next);
  }
};

async function save_popup(req, res, next) {
  const response = {}; 
  
 
  try {
    await PopupModel.updateMany({}, { $set: { status: "inactive" } });
  } catch (updateError) {
    response.title = "error";
    response.status = false;
    response.message = "Error updating existing records.";
    response.data = updateError;
    return res.json(response);
  }
  const utcFromDate = new Date(req.body.from_date).toISOString();
const utcToDate = new Date(req.body.to_date).toISOString();
const overlappingPopup = await PopupModel.findOne({
  $or: [
    {
      $and: [
        { from_date: { $lte: utcToDate } },
        { to_date: { $gte: utcFromDate } },
      ],
    },
  ],
});

if (overlappingPopup) {
  response.title = "error";
  response.status = false;
  response.message = "Selected date range overlaps with an existing popup.";
  return res.json(response);
}

  const newData = new PopupModel({
    title: req.body.title,
    from_date: utcFromDate,
    to_date: utcToDate,
    description: req.body.description,
    image: req.body.image,
    cta_url: req.body.cta_url,
    click_count: req.body.click_count,
    timeout_duration: req.body.timeout_duration,
    status: req.body.status,

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
async function update_popup(req, res, next) {
  var updateData = {};
  if(!req.body.status == "inactive"){
    try {
    
      await PopupModel.updateMany(
         { status: 'active' }, // Find all records with status 'active'
         { $set: { status: 'inactive' } } // Update the status to 'inactive'
         );
     } catch (updateError) {
       response.title = "error";
       response.status = false;
       response.message = "Error updating existing records.";
       response.data = updateError;
       return res.json(response);
     }
  }
 
  for (var field in req.body) {
    updateData[field] = req.body[field];
  }

  //Update the details of the Popup in database
  PopupModel.findOneAndUpdate(
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
exports.get_all_popups = (req, res, next) => {
    PopupModel.find()
  .sort({_id: -1})
  .exec()
  .then((result) => {
    response.title = "success";
    response.status = true;
    response.data = result;
    response.message = "Popup displayed successfully!!";
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

//--------Get Active Popup---------//
exports.get_active_popups = (req, res, next) => {
  PopupModel.find({status:"active"})
.exec()
.then((result) => {
  response.title = "success";
  response.status = true;
  response.data = result;
  response.message = "Active Popup displayed successfully!!";
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
exports.delete_popups = (req, res) => {
    PopupModel.findOneAndDelete({ _id: req.params.popup_id })
    .exec()
    .then((info) => {
      response.title = "success";
      response.status = true;
      response.data = info;
      response.message = "Popup deleted successfully";
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

exports.increase_count = async(req, res, next) => {
  let banner_id = req.body.popup_id;  

  PopupModel.findOneAndUpdate({_id: banner_id},{$inc: { click_count: 1}},{new: true}).exec()
  .then(result => {
      return res.json({
          status: true,
          message: "Count Updated Successfully!",
          title: "success"
      })
  })
  .catch(err => {
      return res.json({
          status: false,
          message: "Something went wrong!",
          title: "error"
      })
  })
}


require("dotenv").config();
const mongoose = require("mongoose");

// const LiveProductsModel = require("../../models/LiveProductsModel");
const certificateModel       = require("../models/certificateModel");
const personnelcertificateModel       = require("../models/personnelModel");
const axios = require("axios");
const ObjectId = mongoose.Types.ObjectId;

let response = {
  status: true,
  message: "",
  data: {},
};

//Create certificat
exports.create_certificate = (req, res, next) => {
  // If _id is null it will save certificate otherwsie update certificate
  if (req.body._id === null || req.body._id === "null") {
    save_certificate(req, res, next);
  } else {
    update_certificate(req, res, next);
  }
};

//Function to save the certificate
async function save_certificate(req, res, next) {
  let data = new certificateModel({
    certificationtitle: req.body.certificationtitle,
    certificationaddress: req.body.certificationaddress,
    certificationscope: req.body.certificationscope,
    certificationregistration: req.body.certificationregistration,
    certificationexpiry: req.body.certificationexpiry,
    is_active: req.body.is_active
  });
  data
    .save()
    .then(async (info) => {
      response.title = "success";
      response.status = true;
      response.data = info;
      response.message = "Certificate added successfully";
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

//Function to update the certificate
async function update_certificate(req, res, next) {
  var updateData = {};
  for (var field in req.body) {
    updateData[field] = req.body[field];
  }

  //Update the details of the certificate in database
  certificateModel.findOneAndUpdate(
    { _id: req.body._id },
    { $set: updateData },
    { new: true }
  )
    .exec()
    .then((info) => {
      response.title = "success";
      response.status = true;
      response.data = info;
      response.message = "Certificate updated successfully!";
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

//API to get all the certificate
exports.get_all_certificate = (req, res, next) => {
  certificateModel.find({ }).sort({"createdAt": -1 })
  .sort({_id: -1})
  .exec()
  .then((result) => {
    response.title = "success";
    response.status = true;
    response.data = result;
    response.message = "Certificate displayed successfully!!";
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

//API to delete the certificate
exports.delete_certificate = (req, res) => {
  certificateModel.findOneAndDelete({ _id: req.params.id })
    .exec()
    .then((info) => {
      response.title = "success";
      response.status = true;
      response.data = info;
      response.message = "Certificate deleted successfully";
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

//Create certificat
exports.personnal_create_certificate = (req, res, next) => {
  // If _id is null it will save certificate otherwsie update certificate
  if (req.body._id === null || req.body._id === "" || req. body._id === 'null') {
    p_save_certificate(req, res, next);
  } else {
    p_update_certificate(req, res, next);
  }
};

//Function to save the certificate
async function p_save_certificate(req, res, next) {
  try {
    const existingCertificate = await personnelcertificateModel.findOne({
      personnel_certificate_no: req.body.certificate_no
    });

    if (existingCertificate) {
      return res.json({
        title: "error",
        status: false,
        data: existingCertificate,
        message: "Certificate number already exists in the database."
      });
    }

    const data = new personnelcertificateModel({
      personnel_name: req.body.personnel_name,
      personnel_course: req.body.personnel_course,
      personnel_registration: req.body.personnel_registration,
      personnel_country: req.body.personnel_country,
      personnel_photo: req.body.personnel_photo,
      personnel_certificate_no: req.body.personnel_certificate_no
    });

    const savedCertificate = await data.save();

    return res.json({
      title: "success",
      status: true,
      data: savedCertificate,
      message: "Certificate Personnel added successfully"
    });
  } catch (err) {
    return res.status(500).json({
      title: "error",
      status: false,
      data: err,
      message: "Something went wrong!"
    });
  }
}


//Function to update the certificate
async function p_update_certificate(req, res, next) {
  var updateData = {};

  for (var field in req.body) {
    updateData[field] = req.body[field];
  }

  //Update the details of the certificate in database
  personnelcertificateModel.findOneAndUpdate(
    { _id: req.body._id },
    { $set: updateData },
    { new: true }
  )
    .exec()
    .then((info) => {
      response.title = "success";
      response.status = true;
      response.data = info;
      response.message = "Certificate updated successfully!";
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


//API to delete the certificate
exports.p_delete_certificate = (req, res) => {
  personnelcertificateModel.findOneAndDelete({ _id: req.params._id })
    .exec()
    .then((info) => {
      response.title = "success";
      response.status = true;
      response.data = info;
      response.message = "Certificate deleted successfully";
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
//API to get all the certificate
exports.get_all_personnel_certificate = (req, res, next) => {
  personnelcertificateModel.find({ }).sort({"createdAt": -1 })
  .sort({_id: -1})
  .exec()
  .then((result) => {
    response.title = "success";
    response.status = true;
    response.data = result;
    response.message = "Certificate displayed successfully!!";
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


exports.search_personnel_certificate = (req, res, next) => {
  const { personnel_name, certificate_no } = req.body;

  const searchQuery = {
    $and: [
      { personnel_name: { $regex: personnel_name, $options: 'i' } }, // Case-insensitive search for personnel_name
      { personnel_certificate_no: { $regex: certificate_no, $options: 'i' } } // Case-insensitive search for personnel_certificate_no
    ]
  };

  personnelcertificateModel.find(searchQuery)
    .sort({ createdAt: -1 })
    .exec()
    .then((result) => {
      if (result.length > 0) {
        return res.status(200).json({
          title: 'success',
          status: true,
          data: result,
          message: 'Certificates displayed successfully!'
        });
      } else {
        return res.status(404).json({
          title: 'error',
          status: false,
          data: [],
          message: 'No matching certificates found!'
        });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        title: 'error',
        status: false,
        data: [],
        message: 'Something went wrong!'
      });
    });
};

exports.search_certificate = (req, res, next) => {
  const { certificationtitle } = req.body;
  console.log("asf",certificationtitle)
  const searchQuery = {
    $or: [
      { certificationtitle: { $regex: certificationtitle, $options: 'i' } }, // Case-insensitive search for personnel_name
    ]
  };

  certificateModel.find(searchQuery)
    .sort({ createdAt: -1 })
    .exec()
    .then((result) => {
      if (result.length > 0) {
        return res.status(200).json({
          title: 'success',
          status: true,
          data: result,
          message: 'Certificates displayed successfully!'
        });
      } else {
        return res.status(404).json({
          title: 'error',
          status: false,
          data: [],
          message: 'No matching certificates found!'
        });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        title: 'error',
        status: false,
        data: [],
        message: 'Something went wrong!'
      });
    });
};



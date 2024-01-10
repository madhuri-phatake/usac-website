var express = require('express');
var router = express.Router();
const Cryptr = require('cryptr');
const cryptr = new Cryptr("10");

const UserModel = require("../models/UserModel");
const msg91 = require("msg91")("319966AWb3Z1Vvye5e53db71P1", "DSHSMS", "4");

//Add user

router.post('/add_user', function (req, res, next) {
  console.log(req.body);
  UserModel.find({
    mobile_number: req.body.mobile_number
  }, async function (err, docs) {
    if (docs.length) {
      let response = new Object();
      response.title = 'error';
      response.message = "Mobile number already exist!";
      response.data = err;
      return res.json(response);
    } else {
      const user = new UserModel();
      user.name = req.body.name;
      user.mobile_number = req.body.mobile_number;
      user.email_id = req.body.email;
      user.address = req.body.address;
      user.user_type = req.body.user_type;
      user.user_status = req.body.user_status;
      // user.user_access = req.body.user_access;
      await user.save((err) => {
        if (err) {
          let response = new Object();
          response.title = 'error';
          response.message = "Something Went Wrong..!";
          response.data = err;
          return res.json(response);
        } else {
          let response = new Object();
          response.title = "success";
          response.message = "User created successfully!";
          return res.json(response);
          // msg91.send(req.body.mobile_number, "Your Account has been created on YCL Panel. Kindly use your Mobile Number " + req.body.mobile_number + " for Login.", function (err, resp) {
          // if (err) throw err
          // if (resp) {
          //   let response = new Object();
          //   response.title = "success";
          //   response.message = "Vendor created successfully!";
          //   return res.json(response);
          // }
          // });
        }
      });
    }
  });

});


//Update User
router.post('/update_user', async function (req, res, next) {
  UserModel.findByIdAndUpdate({
      _id: req.body.id
    }, {
      name: req.body.name,
      mobile_number: req.body.mobile_number,
      email_id: req.body.email,
      address: req.body.address,
      user_type: req.body.user_type,
      user_status: req.body.user_status,
      user_access: req.body.user_access
    }, {
      new: true
    })
    .exec().then(data => {
      let response = new Object();
      response.title = "success";
      response.message = "User updated successfully!";
      return res.json(response);
    }).catch(err => {
      let response = new Object();
      response.title = 'error';
      response.message = "Something Went Wrong..!";
      response.data = err;
      return res.json(response);
    });
});

router.get('/get_all_users', async function (req, res, next) {
  const data = await UserModel.find().sort({
    createdAt: -1
  });
  let response = new Object();
  response.message = "records fetched successfully";
  response.title = "success";
  response.data = data;
  return res.json(response);
});

router.post('/get_users_for_table', async function (req, res, next) {
  // let count = null;
  // await UserModel.count().then(recordsCount =>  count = recordsCount);
  // const data = await UserModel.find().skip(parseInt(req.body.start)).limit(parseInt(req.body.length)).sort({"createdAt": -1});
  const data = await UserModel.find().sort({"createdAt": -1});
  let response = new Object();
  response.data = data;
  response.message = "records fetched successfully";
  response.title = "success";
  // response.recordsTotal = count;
  // response.draw = req.body.draw;
  return res.json(response);
});

router.delete('/delete_user/:id', async function (req, res, next) {
  try {
    await UserModel.findOneAndDelete({
      _id: req.params.id
    });
    let response = new Object();
    response.title = "success";
    response.message = "User deleted successfully!";
    return res.json(response);
  } catch (ex) {
    let response = new Object();
    response.title = "error";
    response.message = "Something Went Wrong..!";
    return res.json(response);
  }
});

module.exports = router;
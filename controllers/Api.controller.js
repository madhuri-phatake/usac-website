const Cryptr = require('cryptr');
const cryptr = new Cryptr("10");
const moment = require("moment");
const mongoose = require("mongoose");
const rp = require('request-promise');
const cron = require('node-cron');
const fs = require('fs');
const config = require("../config/keys");
const nodemailer = require("nodemailer");
// const helper = require("./helper");

const { json } = require('body-parser');

let response = new Object();

exports.register_vendor = async (req, res, next) => {

    VendorModel.findOne({
        gst_number: req.body.gst_number
    })
        .exec()
        .then(info => {
            if (info) {
                response.title = "error";
                response.status = false;
                response.data = null;
                response.message = "GSTIN number already exists!";
                return res.json(response);
            } else {
                VendorModel.find({
                    mobile_number: req.body.mobile_number
                }, async function (err, docs) {
                    if (docs.length) {
                        response.title = 'error';
                        response.message = "Mobile number already exist!";
                        response.data = err;
                        return res.json(response);
                    } else {
                        VendorModel.find({
                            pan_number: req.body.pan_number
                        }, async function (err, docs) {
                            if (docs.length) {
                                response.title = 'error';
                                response.message = "PAN number already exist!";
                                response.data = err;
                                return res.json(response);
                            } else {
                                const vendor = new VendorModel();
                                req.body.first_name = titleCase(req.body.first_name);
                                req.body.last_name = titleCase(req.body.last_name);
                                req.body.company_name = titleCase(req.body.company_name);
                                var vendor_url = req.body.company_name.replace(/[^A-Z0-9]+/ig, '-').toLowerCase();
                                vendor.company_name = req.body.company_name;
                                vendor.first_name = req.body.first_name;
                                vendor.last_name = req.body.last_name;
                                vendor.mobile_number = req.body.mobile_number;
                                vendor.email_id = req.body.email_id;
                                vendor.company_address = req.body.company_address;
                                vendor.pin_code = req.body.pin_code;
                                vendor.pan_number = req.body.pan_number;
                                vendor.pan_url = req.body.pan_url;
                                vendor.gst_number = req.body.gst_number;
                                vendor.gst_url = req.body.gst_url;
                                vendor.fssai_number = req.body.fssai_number;
                                vendor.fssai_url = req.body.fssai_url;
                                vendor.brand_trademark_url = req.body.brand_trademark_url;
                                vendor.alternate_contacts = req.body.alternate_contacts;
                                vendor.customer_care = req.body.customer_care;
                                vendor.grievance_details = req.body.grievance_details;
                                vendor.website = req.body.website;
                                vendor.legal_status = req.body.legal_status;
                                vendor.sampler_address_id = config.sampler_address_id;
                                vendor.bank_name = req.body.bank_name;
                                vendor.bank_number = req.body.bank_number;
                                vendor.ifsc_code = req.body.ifsc_code;
                                vendor.upload_check_url = req.body.upload_check_url;
                                vendor.save((err) => {
                                    if (err) {
                                        response.title = 'error';
                                        response.message = "Something Went Wrong..!";
                                        response.data = err;
                                        return res.json(response);
                                    } else {
                                        response.title = "success";
                                        response.message = "Vendor created successfully!";
                                        return res.json(response);
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
};

//API to update the vendor information
exports.update_vendor = async (req, res, next) => {
    var new_pick = req.body.pickup_addresses
    var data = await VendorModel.findById({ _id: req.body.vendor_id })
    var old_add = data.pickup_addresses
    console.log(req.body)
    if (req.body.vendor_background_url == "") {
        req.body.banner_img = []
    }

    if (req.body["banner_img"] != undefined) {
        if (req.body.banner_img.length === 0) {
            req.body.vendor_background_url = ""
        }

    }

    if (req.body.first_name) {
        req.body.first_name = titleCase(req.body.first_name);
        req.body.last_name = titleCase(req.body.last_name);
    }
    if (req.body.company_name) {
        req.body.company_name = titleCase(req.body.company_name);
        req.body.vendor_url = req.body.company_name.replace(/[^A-Z0-9]+/ig, "-").toLowerCase();
    }
    var updateData = {};
    for (var field in req.body) {
        updateData[field] = req.body[field];
    }
    //Update the details of the user in database
    VendorModel.findOneAndUpdate({
        _id: req.body.vendor_id
    }, {
        $set: updateData
    }, { new: true })
        .exec()
        .then((info) => {

            if(new_pick != undefined && new_pick!=null && new_pick!="")
            {
            // A comparer used to determine if two entries are equal.
            const isSameUser = (new_pick, old_add) => new_pick.seller_name === old_add.seller_name && new_pick.mobile_number === old_add.mobile_number && new_pick.building_no === old_add.building_no && new_pick.street_name === old_add.street_name && new_pick.landmark === old_add.landmark && new_pick.state === old_add.state && new_pick.city === old_add.city && new_pick.pincode === old_add.pincode;
            // Get items that only occur in the left array,
            // using the compareFunction to determine equality.
            const onlyInLeft = (left, right, compareFunction) =>left.filter(leftValue => !right.some(rightValue =>compareFunction(leftValue, rightValue)));
        
            const onlyInA = onlyInLeft(new_pick, old_add, isSameUser);
            const onlyInB = onlyInLeft(old_add, new_pick, isSameUser);
            // console.log("onlyInA", onlyInA);
            // console.log("onlyInB", onlyInB);
            const result = [...onlyInA, ...onlyInB];
            if (result.length != 0) {
                var o = ``
                old_add.map(info => {
                    o += `<li>${info.seller_name},${info.building_no},${info.street_name},${info.landmark},${info.state},${info.city},${info.pincode}</li>`
                })

                var n = ``
                new_pick.map(info => {
                    n += `<li>${info.seller_name},${info.building_no},${info.street_name},${info.landmark},${info.state},${info.city},${info.pincode}</li>`
                })
                var to = config.update_vendor
                var subject = `${req.body.first_name} ${req.body.last_name} has updated Pickup address`
                var text = `<p>Following Vendor has updated the Pickup address: <br><br>
                    Vendor Name: ${req.body.first_name} ${req.body.last_name}
                    <br><br>
                    Old Pickup Address: ${o}
                    New Pickup Address: ${n}
                    </p>`
                helper.send_email(subject, text, to)
            }
        }


            response.title = "success";
            response.status = true;
            response.data = info;
            response.message = "Vendor profile updated successfully!";
            return res.json(response);
        })
        .catch(err => {
            response.title = "error";
            response.status = false;
            response.data = err;
            response.message = "Something Went Wrong!";
            return res.json(response);
            next(err);
        });
}

//API to update the vendor information
exports.add_vendor_for_offer = async (req, res, next) => {
    var updateData = {};
    for (var field in req.body) {
        updateData[field] = req.body[field];
    }
    //Update the details of the user in database
    VendorModel.findOneAndUpdate({
        _id: req.body.vendor_id
    }, {
        $set: updateData
    }, {
        new: true
    })
        .exec()
        .then((info) => {
            response.title = "success";
            response.status = true;
            response.data = info;
            response.message = "Vendor profile updated successfully!";
            return res.json(response);
        })
        .catch(err => {
            response.title = "error";
            response.status = false;
            response.data = err;
            response.message = "Something Went Wrong!";
            return res.json(response);
            next(err);
        });
}

//API to get the information of vendor
exports.get_vendor_details = async (req, res, next) => {
    //Update the details of the user in database
    VendorModel.findOne({
        _id: req.body.vendor_id
    })
        .exec()
        .then((info) => {
            response.title = "success";
            response.status = true;
            response.data = info;
            response.message = "Vendor data displayed successfully!";
            return res.json(response);
        })
        .catch(err => {
            response.title = "error";
            response.status = false;
            response.data = err;
            response.message = "Something Went Wrong!";
            return res.json(response);
            next(err);
        });
}








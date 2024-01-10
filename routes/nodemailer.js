var express = require("express");
var router = express.Router();
const FormController = require("../controllers/form.controller");
require("dotenv").config();


router.post('/send-email', FormController.save_form_model)
router.get('/get-form-data', FormController.get_form_data)

module.exports = router;
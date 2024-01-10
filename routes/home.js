const express               = require('express');
const router                = express.Router();
const HomeController        = require("../controllers/home.controller");


//Popup API's
router.post('/create_home_slider', HomeController.create_home_slider);
router.delete('/delete_home_slider/:home_slider_id', HomeController.delete_home_slider);
router.get('/get_all_home_slider', HomeController.get_all_home_slider);
router.get('/get_active_home_slider', HomeController.get_active_home_slider);
router.post('/increase_count', HomeController.increase_count);


module.exports = router;
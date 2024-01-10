const express               = require('express');
const router                = express.Router();
const certificateController        = require("../controllers/certificate.controller");


//certificate API's
router.post('/create_certificate', certificateController.create_certificate);
router.get('/get_all_certificate', certificateController.get_all_certificate);
router.delete('/delete_certificate/:id', certificateController.delete_certificate);

// personnel apis
router.post("/personnel_certificate", certificateController.personnal_create_certificate)
router.get("/personnel_get_certificate", certificateController.get_all_personnel_certificate)
router.delete('/delete_personnel_certificate/:_id', certificateController.p_delete_certificate);

router.post('/search_personnel_certificate', certificateController.search_personnel_certificate)
router.post('/search_certificate', certificateController.search_certificate)




module.exports = router;
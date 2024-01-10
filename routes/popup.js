const express               = require('express');
const router                = express.Router();
const PopupController        = require("../controllers/popup.controller");


//Popup API's
router.post('/create_popup', PopupController.create_popup);
router.delete('/delete_popups/:popup_id', PopupController.delete_popups);
router.get('/get_all_popups', PopupController.get_all_popups);
router.get('/get_active_popups', PopupController.get_active_popups);
router.post('/increase_count', PopupController.increase_count);



module.exports = router;
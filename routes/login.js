const express = require('express');
const router = express.Router();
const UserModel = require("../models/UserModel");
const Cryptr = require('cryptr');
const cryptr = new Cryptr("10");
// const session = require('express-session');
// const cookieParser = require('cookie-parser');
const axios = require('axios');
// var redis = require("redis");
// var redisStore = require('connect-redis')(session);
// var redisClient = redis.createClient();

let setotp = null;

// router.use(cookieParser());
// router.use(session({
//     secret: 'lukewellness@123#',
//     store: new redisStore({
//         host: 'luke-test-redis.bjlo9b.0001.aps1.cache.amazonaws.com',
//         port: 6379,
//         client: redisClient
//     }),
//     saveUninitialized: false,
//     resave: false
// }));


//--------------------- Check user exist-------------------------------------------- 
router.post('/check_mobile_number_exist', function (req, res, next) {
    UserModel.findOne({
            mobile_number: req.body.mobile_number
        })
        .then(data => {
            if (data.password == null) {
                let response = new Object();
                response.title = "success";
                response.password = null;
                response._id = data._id;
                return res.json(response);
            } else {
                let response = new Object();
                response.title = "success";
                response.password = "true";
                response._id = data._id;
                return res.json(response);
            }
        })
        .catch(error => {
            let response = new Object();
            response.title = "error";
            response.name = "Error";
            response.message = "Something Went wrong !";
            return res.json(response);
        });
});


router.post('/send_otp', async function (req, res, next) {

    if (req.body.mobile_number == null || req.body.mobile_number == undefined || req.body.mobile_number == "") {
        const response = new Object();
        response.title = "error";
        response.message = "Please enter mobile number";
        return res.json(response);
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const url = 'https://api.pinnacle.in/index.php/sms/json';
    const postData = {
        'message': [{
            'number': '91' + req.body.mobile_number,
            'text': `Adbanao:\n ${otp} is your  OTP.`
        }],
        'sender': 'UCRLYF',
        'messagetype': 'TXT',
        'dlttempid':'1507162027571519239',
        'dltentityid':'1501389450000027179',
        'dltheaderid': '1505162020750841515'
    };
    const headers = {
        headers: {
            'Content-Type': 'application/json',
            'apikey': '6f7ed5-70756b-76e7d5-3cf3f3-5a1c8d'
        }
    };
    axios.post(url, postData, headers).then(values => {
        if (values.data.status == "success") {
            setotp = otp;
            const response = new Object();
            response.title = "success";
            response.message = "OTP sent to your mobile number";
            return res.json(response);
        } else {
            const response = new Object();
            response.title = "error";
            response.message = "Something went wrong";
            return res.json(response);
        }
    });
});

router.post('/check_otp', function (req, res, next) {

    if (setotp == req.body.otp) {
        let response = new Object();
        response.title = "success";
        response.name = "Success";
        response.message = "Your OTP matched successfully";
        return res.json(response);
    } else {
        let response = new Object();
        response.title = "error";
        response.name = "Error";
        response.message = "Please enter valid otp ";
        return res.json(response);

    }
});


router.put('/create_password', async function (req, res, next) {
    try {
        const encryptedString = cryptr.encrypt(req.body.password);
        const user = await UserModel.findByIdAndUpdate({
            _id: req.body.id
        }, {
            password: encryptedString
        }, {
            new: true
        });
        let response = new Object();
        response.status = 200;
        response.title = "success";
        response.message = "Password updated successfully!";
        return res.json(response);
    } catch (error) {
        let response = new Object();
        response.status = 404;
        response.title = "error";
        response.message = "Something Went Wrong..!";
        return res.json(response)
        next(error);
    }
});

//--------------------- GET USER LIST -------------------------------------------- 
router.post('/login_user', function (req, res, next) {
    const checkmob = UserModel.findOne({
        mobile_number: req.body.mobile_number
    });
    checkmob.exec((err, data) => {
        if (err) throw err;
        var get_password = data.password;
        const pass = cryptr.decrypt(get_password);
        if (pass == req.body.password) {
            if (data.user_status == "active") {
                req.session.id = data._id;
                req.session.user_id = data._id;
                req.session.name = data.name;
                req.session.email_id = data.email_id;
                req.session.user_status = data.user_status;
                req.session.user_type = data.user_type;
                req.session.user_access = JSON.stringify(data.user_access);
                let response = new Object();
                response.title = "success";
                response.message = "Login Successful!";
                return res.json(response);
            } else {
                let response = new Object();
                response.title = "error";
                response.message = "You are not an active user.";
                return res.json(response);
            }
        } else {
            let response = new Object();
            response.title = "error";
            response.message = "Please check your password & try again.";
            return res.json(response);
        }
    });
});

router.post('/logout', function (req, res, next) {
    req.session.destroy();
    res.clearCookie('user_sid');
    res.redirect('/login');
})

module.exports = router;
const createError       = require('http-errors');
const express           = require('express');
const path              = require('path');
const cookieParser      = require('cookie-parser');
const logger_m          = require('morgan');
const cors              = require('cors');
const bodyParser        = require('body-parser');
const moment            = require('moment');
moment().format();

const apiRouter         = require('./routes/api');
const indexRouter       = require('./routes/render_pages');
const userRouter        = require('./routes/users');
const loginRouter       = require('./routes/login');
const masterRouter      = require('./routes/master');
const webMasterRouter   = require('./routes/web_master');
const homePageRouter    = require('./routes/home')
const nodemailer             = require("./routes/nodemailer")
const certificate             = require("./routes/certificate")
const popups             = require("./routes/popup")
const fileUpload             = require("./routes/fileUpload")
const app               = express();
const redisConfig       = require("./config/redisConfig");
const session = require('express-session');
var redis = require("redis");
const connectRedis = require('connect-redis');
require("dotenv").config();

const {
    WEB_URL,
    API_URL,
    BASE_URL,
    BRANCH_URL
} = process.env;

const RedisStore = connectRedis(session)
//Configure redis client
const redisClient = redis.createClient({
    host: process.env.REDIS,
    port: 6379
})
redisClient.on('error', function (err) {
    console.log('Could not establish a connection with redis. ' + err);
});
redisClient.on('connect', function (err) {
    console.log('Connected to redis successfully');
});

//Configure session middleware
app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: 'lukewellness@123#',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // if true only transmit cookie over https
        httpOnly: false, // if true prevent client side JS from reading the cookie 
        maxAge: 1000 * 60 * 60* 24 // session max age in miliseconds
    }
}))
// added cookies  parser //
app.use(cookieParser());

app.locals.baseURL      = BASE_URL; 
app.locals.apiURL       = API_URL;
app.locals.webURL       = WEB_URL;
app.locals.branchURL    = BRANCH_URL;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json({
    limit: '20mb' 
}));
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '20mb'
}));

app.use(logger_m('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH");
    next();
});

app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/users', userRouter);
app.use('/certificate', certificate);
app.use('/', fileUpload);
app.use('/',nodemailer)
app.use('/login', loginRouter);
// app.use('/vendors_report', vendorRouter);
// app.use('/vendor_login', vendorLoginRouter);
app.use('/master', masterRouter);
// app.use('/products', productsRouter);
app.use('/web_master', webMasterRouter);
app.use('/homes',homePageRouter)


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;

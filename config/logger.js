const winston = require('winston'),
    WinstonCloudWatch = require('winston-cloudwatch');
const logger = new winston.createLogger({
    format: winston.format.json(),
    transports: [
        new(winston.transports.Console)({
            timestamp: true,
            colorize: true,
        })
    ]
});

// if (process.env.NODE_ENV === 'production') {
const cloudwatchConfig = {
    logGroupName: "backend_log_group",
    logStreamName: "backend_log_group-first",
    awsAccessKeyId: "AKIAVBSQVAPD6IWMRE2F",
    awsSecretKey: "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",
    awsRegion: "ap-south-1",
    messageFormatter: ({ level, message, additionalInfo }) => `[${level}] : ${message} \nAdditional Info: ${JSON.stringify(additionalInfo)}}`
}
logger.add(new WinstonCloudWatch(cloudwatchConfig));
// }
// const {
//     createLogger,
//     transports,
//     format
// } = require('winston');
// // require('winston-mongodb');
// const logger = createLogger({
//     transports: [
//         new transports.File({
//             filename: 'info.log',
//             level: 'info',
//             format: format.combine(format.timestamp(), format.json())
//         }) //,
// new transports.MongoDB({
//     level: 'error',
//     db: process.env.MONGODB,
//     options: {
//         useUnifiedTopology: true
//     },
//     collection: 'babaji',
//     format: format.combine(format.timestamp(), format.json())
// })
// ]
// })

// module.exports = logger;
module.exports = logger;
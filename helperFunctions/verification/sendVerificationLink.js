'use strict';
const nodemailer = require('nodemailer');
const config = require('../../environmentConfig');
console.log('config :', config);
console.log('process.env.NODE_ENV :', process.env_NODE_ENV);
// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing
module.exports = function emailVerificationLink(userDetails){
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_NODEMAILER_USERNAME, // generated ethereal user
            pass: process.env.EMAIL_NODEMAILER_PASSWORD // generated ethereal password
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: process.env.EMAIL_NODEMAILER_USERNAME, // sender address
        to: userDetails.email, // list of receivers
        subject: 'Verification for Ginny Bradley Website', // Subject line
        text: 'verification. Either you or somebody signed you up for this website. Here is a link to verify your email. You will asked to enter a password. The password has a minimum requirement of 8 characters./nIf this sign-up was not you please ignore. The verification link will eventually expire. Please fel free to email any concerns you may have. please click the below link',
        html: `<a href="${config.url}?email=${userDetails.email}&token=${userDetails.token}>` // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log("Message %s sent: %s", info.messageId, info.response);
        return "success";

    });
}
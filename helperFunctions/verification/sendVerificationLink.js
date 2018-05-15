const nodemailer = require('nodemailer');
const config = require('../../environmentConfig');
console.log('config :', config);
console.log('process.env.NODE_ENV :', process.env_NODE_ENV);
module.exports = function emailVerificationLink(userDetails){
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_NODEMAILER_USERNAME, 
            pass: process.env.EMAIL_NODEMAILER_PASSWORD 
        }
    });

    let mailOptions = {
        from: process.env.EMAIL_NODEMAILER_USERNAME,
        to: userDetails.email, 
        subject: 'Verification for Ginny Bradley Website', 
        text: 'Here is a link to verify your email. You will asked to enter a password. The password has a minimum requirement of 8 characters./If this sign-up was not you then please ignore as the verification link will expire soon. Please feel free to email any concerns you may have. please click the below link to register your email.',
        html: `<a href="${config.url}?email=${userDetails.email}&token=${userDetails.verificationToken}>Click to be taken to the verification page</a><p> or copy and paste this link or browser. ${config.url}?email=${userDetails.email}&token=${userDetails.verificationToken} </p>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log(`Message ${info.messageId} sent: ${info.response}`);
        return "success";

    });
}
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
        from: process.env.EMAIL_NODEMAILER_USERNAME, // sender address
        to: userDetails.email, 
        subject: 'Password change confirmation for Ginny Bradley Website', 
        text: 'You have requested a password reset. Please click the link and reset your password. This link will expire soon',
        html: `<a href="${config.url}?email=${userDetails.email}&token=${userDetails.verificationToken}>Click to be taken to the verification page</a><p> or copy and paste this link or browser. ${config.url}?email=${userDetails.email}&token=${userDetails.verificationToken}` 
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log(`Message ${info.messageId} sent: ${info.response}`);
        return "success";

    });
}
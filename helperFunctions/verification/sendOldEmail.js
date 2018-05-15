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
        text: 'Confirmation that email has been changed for the Ginny Bradley website',
        html: `` 
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
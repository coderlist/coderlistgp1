const nodemailer = require('nodemailer');
const transportEmailConfig = require('./transportEmailConfig');
const config = require('../../environmentConfig');

class MailSender {
   constructor () {
  }

  sendPasswordReset(userDetails) {
    const passwordReset = {
      from: process.env.EMAIL_NODEMAILER_USERNAME, // sender address
      to: userDetails.email, 
      subject: 'Password reset link for Ginny Bradley Website', 
      text: 'You have requested a password reset. Please click the link and reset your password. This link will expire in 60 minutes',
      html: `<a href="${config.url}?email=${userDetails.email}&token=${userDetails.verificationToken}>Click to be taken to the verification page</a><p> or copy and paste this link or browser. ${config.url}?email=${userDetails.email}&token=${userDetails.verificationToken}`
    }
    const transporter = nodemailer.createTransport(transportEmailConfig);
    transporter.sendMail(passwordReset, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log(`Message ${info.messageId} sent: ${info.response}`);
      return "success";
    });
  }

  sendToOldEmail(userDetails) {
    const oldEmail = {
      from: process.env.EMAIL_NODEMAILER_USERNAME,
      to: userDetails.email, 
      subject: 'Email change confirmation for Ginny Bradley Website', 
      text: 'Confirmation that email has been changed for the Ginny Bradley website',
      html: `` 
    }
    const transporter = nodemailer.createTransport(transportEmailConfig);
    transporter.sendMail(oldEmail, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log(`Message ${info.messageId} sent: ${info.response}`);
      return "success";
    });
  }

  sendPasswordChangeConfirmation(userDetails) {
    const passwordChangeConfirmation = {
      from: process.env.EMAIL_NODEMAILER_USERNAME, // sender address
      to: userDetails.email, 
      subject: 'Password change confirmation for Ginny Bradley Website', 
      text: 'Confirmation that email password changed for the Ginny Bradley website',
      html: `` 
   }
    const transporter = nodemailer.createTransport(transportEmailConfig);
    transporter.sendMail(passwordChangeConfirmation, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log(`Message ${info.messageId} sent: ${info.response}`);
      return "success";
    });
  }

  sendVerificationLink(userDetails) {
    const verificationLink = {
      from: process.env.EMAIL_NODEMAILER_USERNAME,
      to: userDetails.email, 
      subject: 'Verification for Ginny Bradley Website', 
      text: 'Here is a link to verify your email which will expire in one week. You will asked to enter a password. The password has a minimum requirement of 8 characters.If this sign-up was not you then please ignore as the verification link will expire soon. Please feel free to email any concerns you may have. please click the below link to register your email.',
      html: `<a href="${config.url}?email=${userDetails.email}&token=${userDetails.verificationToken}>Click to be taken to the verification page</a><p> or copy and paste this link or browser. ${config.url}?email=${userDetails.email}&token=${userDetails.verificationToken} </p>`
    }
    const transporter = nodemailer.createTransport(transportEmailConfig);
    transporter.sendMail(verificationLink, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log(`Message ${info.messageId} sent: ${info.response}`);
      return "success";
    });
  }
}

module.exports = MailSender;
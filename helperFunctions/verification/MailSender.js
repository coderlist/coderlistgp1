const ejs = require("ejs");
const nodemailer = require('nodemailer');
const transportEmailConfig = require('./transportEmailConfig');
const config = require('../../environmentConfig');
const forgotPasswordEmail = './views/pages/email/forgot-password.ejs';
const signupEmail = './views/pages/email/sign-up.ejs';
const changeEmailVerification = './views/pages/email/change-email-verification.ejs';


class MailSender {
   constructor () {
  }

  sendPasswordReset(userDetails) {
    ejs.renderFile(forgotPasswordEmail, {userDetails: userDetails, config: config}, function(err, data){
      if (err) {
        console.log('err :', err);
      }
      else {
        const passwordReset = {
          from: process.env.EMAIL_NODEMAILER_USERNAME, // sender address
          to: userDetails.email, 
          subject: 'Password reset link for Ginny Bradley Website', 
          text: 'You have requested a password reset. Please click the link and reset your password. This link will expire in 60 minutes',
          html: data
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
    });
  }

  sendToOldEmail(userDetails) {
    const oldEmail = {
      from: process.env.EMAIL_NODEMAILER_USERNAME,
      to: userDetails.old_email, 
      subject: 'Email change confirmation for Ginny Bradley Website sent to old email', 
      text: `Confirmation that your email has been changed for the Ginny Bradley website to ${userDetails.new_email}`,
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

  sendEmailChangeConfirmation(userDetails) {
    
    const emailChangeConfirmation = {
      from: process.env.EMAIL_NODEMAILER_USERNAME, // sender address
      to: userDetails.new_email, 
      subject: 'New Email change confirmation for Ginny Bradley Website', 
      text: `Confirmation that email has been changed for the Ginny Bradley website from ${userDetails.old_email}`,
      html: `` 
   }
    const transporter = nodemailer.createTransport(transportEmailConfig);
    transporter.sendMail(emailChangeConfirmation, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log(`Message ${info.messageId} sent: ${info.response}`);
      return "success";
    });
  }

  sendEmailChangeVerificationLink(userDetails) {
    ejs.renderFile(changeEmailVerification, {userDetails: userDetails, config: config}, function(err, data){
      if (err) {
        console.log('err :', err);
      }
      else {
        console.log('userDetails :', userDetails);
        const newEmailLink = {
          from: process.env.EMAIL_NODEMAILER_USERNAME,
          to: userDetails.new_email, 
          subject: 'New email verification link for Ginny Bradley Website', 
          text: 'new email verification link',
          html: data
        }
        const transporter = nodemailer.createTransport(transportEmailConfig);
        transporter.sendMail(newEmailLink, (error, info) => {
          if (error) {
              return console.log(error);
          }
          console.log(`Message ${info.messageId} sent: ${info.response}`);
          return "success";
        });
      }
    })
  }

  sendVerificationLink(userDetails) {
    ejs.renderFile(signupEmail, {userDetails: userDetails, config: config}, function(err, data){
      if (err) {
        console.log('err :', err);
      }
      else {
        console.log('userDetails :', userDetails);
        const verificationLink = {
          from: process.env.EMAIL_NODEMAILER_USERNAME,
          to: userDetails.email, 
          subject: 'Verification for Ginny Bradley Website', 
          text: 'Here is a link to verify your email which will expire in one week. You will be asked to enter a password. The password has a minimum requirement of 8 characters.If this sign-up was not you then please ignore as the verification link will expire soon. Please feel free to email any concerns you may have. please click the below link to register your email.',
          html: data
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
    })
  }
}

module.exports = MailSender;
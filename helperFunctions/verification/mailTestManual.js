require('dotenv').config()
if(!process.env.NODE_ENV) {
  process.env.NODE_ENV = "development";
}
const Mail = require ('./MailSender.js');

const user = {
  email : "kristiansigston@gmail.com", // put own email here for testing
  verificationToken : "53454534534534534534534534534534534534",
  old_email : "kristiansigston@gmail.com",
  new_email : "kristiansigston@gmail.com",
}

let mail = new Mail();
mail.sendPasswordReset(user);
mail.sendToOldEmail(user);
mail.sendPasswordChangeConfirmation(user);
mail.sendVerificationLink(user);
mail.sendEmailChangeConfirmation(user);
mail.sendEmailChangeVerificationLink(user);
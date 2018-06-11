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
console.log("1");
mail.sendToOldEmail(user);
console.log("2");
mail.sendPasswordChangeConfirmation(user);
console.log("3");
mail.sendVerificationLink(user);
console.log("4");
mail.sendEmailChangeConfirmation(user);
console.log('5');
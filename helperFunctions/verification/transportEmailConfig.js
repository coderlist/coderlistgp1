const transportEmailConfig = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
      user: process.env.EMAIL_NODEMAILER_USERNAME, 
      pass: process.env.EMAIL_NODEMAILER_PASSWORD 
  }
}

module.exports = transportEmailConfig;
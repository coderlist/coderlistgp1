// route middleware to log user out
function logUserOut(req, res, next) {
  
  // uncomment the below line when passport is installed and configured. ****8
  // req.logout() 
  return next();
}

module.exports = logUserOut;
// 
// Proposed algorithm
// delay set to default of 0.1s

// if valid user and invalid password
// compare login to last to attempted login time.
// Was it less than a second ago? Drop.
// Was it less than 5 mins ago. 
// if yes: attempt to login after doubling delay and increment unsuccessful login attempt to +1. Send username and ip to logging system as failure. flash message invalid username or password
// if no: reset failed logins to 0 and attempt to login after 0.1s and increment unsuccessful login attempt by 1. Send username and ip to logging system as failure flash message invalid username or password

//if valid user and valid password
// compare login to last to last login time. 
// Was it less than a second ago? Drop.
// Was it less than 5 mins ago. if yes attempt to login after doubling delay and reset unsuccessful login attempt to +1. send username and ip to logging as success
// if no reset failed logins to 0 and attempt to login after 0.1s and increment unsuccessful login attempt by 1. Send username and ip to logging system as success

//if invalid user check ip invalid ip address users log in the db. store ip address and invalid username and time and flash message invalid username or password
//compare login to last to last login time. 
//if yes: attempt to login after doubling delay and increment unsuccessful login attempt to +1. Send username and ip to logging system as failure. flash message invalid username or password
// if no: reset failed logins to 0 and attempt to login after 0.1s and increment unsuccessful login attempt by 1. Send username and ip to logging system as failure flash message invalid username or password

//the lower check has to perform the same operations as the above to negate potential account enumeration.

//database purge once a week on entries older than a week for invalid user checks.
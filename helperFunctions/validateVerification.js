const validationCheck = [
  check('email').isEmail().normalize(),
  // password must be at least 5 chars long
  check('password').isLength({ min: 5 })
]

export default validationCheck;
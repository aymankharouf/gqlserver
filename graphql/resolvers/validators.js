module.exports.validateRegisterInputs = (username, password, confirmPassword, mobile) => {
  const errors = {}
  if (username.trim() === '') {
    errors.username = 'Username must not be empty'
  }
  if (mobile.trim() === '') {
    errors.mobile = 'Mobile No. must not be empty'
  } else {
    const regEx = /^07[7-9][0-9]{7}$/
    if (!mobile.match(regEx)) {
      errors.mobile = 'Mobile No. must be valid'
    }
  }
  if (password.trim() === '') {
    errors.password = 'Password must not be empty'
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords must match'
  }
  return errors
}

module.exports.validateLoginInput = (mobile, password) => {
  const errors = {}
  if (mobile.trim() === '') {
    errors.mobile = 'Mobile No. must not be empty'
  }
  if (password.trim() === '') {
    errors.password = 'Password must not be empty'
  }
  return errors
}

module.exports.validateCategoryInput = (name) => {
  const errors = {}
  if (name.trim() === '') {
    errors.name = 'name must not be empty'
  }
  return errors
}
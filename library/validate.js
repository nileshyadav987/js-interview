const { body } = require("express-validator");

module.exports.email = function () {
  return [body("email", "Email is required").exists().not().isEmpty()];
};
module.exports.password = function () {
  return [body("password", "Password is required").exists().not().isEmpty()];
};

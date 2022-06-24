//const Config = require('../config');
const jwt = require("jsonwebtoken");
const hashpassword = require("./hashtoken");

var user = {};

function isLoggedIn(req, res, next) {
  try {
    if (Boolean(req.headers.authorization) == false) throw new Error("Token missing");
    let token = req.headers.authorization.replace("Bearer ", "");
    if (Boolean(token) == false) throw new Error("Token missing");
    console.log(token);
    if (token) {
      // verifies secret and checks exp
      hashpassword.verifytoken(token).then(function (decoded) {
        user = decoded;
        next();
      }).catch(err => {
        return res.status(401).json({ message: "Invalid token: " + err });
      });
    } else {
      throw new Error("Sign in to continue.");
    }
  } catch (e) {
    return res.status(401).json({ message: e.toString() });
  }

}
function getUser() {
  return user;
}

module.exports.isLoggedIn = isLoggedIn;
module.exports.getUser = getUser;

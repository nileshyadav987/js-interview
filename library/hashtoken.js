const jwt = require("jsonwebtoken");
module.exports.generatetoken = function (user) {
  return jwt.sign({ email: user.email }, "helloworld");
};


module.exports.verifytoken = function (token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, "helloworld", function (err, decoded) {
      // console.log("hufufujhhfyyf77774746", err);
      if (err) {
        reject(err.toString());
      } else {
        resolve(decoded);
      }
    });
  });
};

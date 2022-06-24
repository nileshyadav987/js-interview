const express = require('express');
const app = express();

const { validationResult } = require("express-validator");
const bodyParser = require('body-parser');
const sqlite = require('sqlite3');
const fs = require('fs');

const validate = require("./library/validate");
const hashpassword = require("./library/hashtoken");
const tm = require("./library/token-middleware");

// import { Sequelize } from 'sequelize';

const models = require("./models");

// const DataModel = require('./models').Data;

//Sync Database
models.sequelize.sync().then(function () {
  console.log('connected to database')
}).catch(function (err) {
  console.log(err)
});

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));


app.post('/signup', [validate.email(), validate.password()], function (req, res) {
  var errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array()[0].msg);
  } else {
    var input = req.body;
    return res.json({ token: hashpassword.generatetoken({ email: input.email, password: input.password }) });
  }
});

app.post('/process', [tm.isLoggedIn], async function (req, res) {
  var errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  } else {
    try {
      // await models.Data.destroy({
      //   truncate: true
      // });
      const dataCount = await models.Data.count();
      if (dataCount > 0) throw new Error("Data already imported");

      var rawdata = fs.readFileSync('./data/data.json');
      rawdata = JSON.parse(rawdata);

      await models.Data.bulkCreate(rawdata);
      return res.json({ message: "Data updated" });
    } catch (e) {
      return res.status(400).json({ message: e.toString() });
    }
  }
});

app.post('/fetch', [tm.isLoggedIn], function (req, res) {
  models.Data.findAll().then(d => {
    return res.json(d);
  }).catch(err => {
    return res.status(400).json({ message: "Error here" });
  });

});


var server = app.listen(8081, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Example app listening at http://%s:%s", host, port);
});
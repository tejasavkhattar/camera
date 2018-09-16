#!/usr/bin/env node


TD_API_KEY = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJDQlAiLCJ0ZWFtX2lkIjoiYjk3NzY4ZmQtZTNmYi0zMTRmLWI1MTQtNDE0MDFmZGVhZmY4IiwiZXhwIjo5MjIzMzcyMDM2ODU0Nzc1LCJhcHBfaWQiOiIwY2VjYjYxOS1iNjlkLTQyNDYtYWM1YS1hNzgwMTExODg3YmYifQ.Ga1O9LoHVJzuGV_GOJtrrSBwi_MwHSrPenzvw0Vpgrg"

TD_TEAM_TOKEN = "0cecb619-b69d-4246-ac5a-a780111887bf"

initialCustomerId = "0cecb619-b69d-4246-ac5a-a780111887bf_c18dca28-f10f-4a0a-b905-db636046bd4c"

var https = require("https");
var express = require("express");
    // request = require('request');
    express_app = express();
    const multer = require('multer')
    fs = require("fs");
    require('dotenv').config()

    const util = require('util') // for printing objects
    const reqq = require('request-promise-native');


//Handles file storage when it gets sent into the POST request form.
    var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/')
    },
    filename: function (req, file, cb) {
        cb(null, "search.png")
  }
})
    var upload = multer({ storage: storage })



const Clarifai = require('clarifai');


const app = new Clarifai.App({
 apiKey: 'a19fd98f7e3a410f943b3896d4e8bd54'
});

function TD_options(method, uri, body = null) {
  return {
    json: true,
    body: body,
    uri: 'https://api.td-davinci.com/api/' + uri,
    method: method,
    headers: { 'Authorization': TD_API_KEY }
  };
}





function handleError(err) {
  let outErr = err;
  if (err.response) {
    if (err.response.body) {
      outErr = err.response.body;
      console.dir(outErr.errorDetails);
    } else {
      outErr = err.response;
    }
  }
  console.dir(outErr);
  process.exit(1);
}

function printCustomer(arrayOfResponses) {
  arrayOfResponses[0]
  arrayOfResponses[1]
  // console.log(resp)
  // retunr
  // const cust = resp.result;
  // console.log(resp)
  // console.log("\nCustomer\n- Name: " + cust.givenName + " " + cust.surname);
  // console.log("- Address: " + util.inspect(cust.addresses.principalResidence));
}

    express_app.use(express.static('public'));
    express_app.use(express.static(__dirname));

    express_app.get("/", function(req, res) {
      res.sendFile(__dirname + "./index.html");
    })
    express_app.post("/file", upload.single('img'), function(req,res) {

//	console.log("file")
      app.models.predict("production", "https://pos.dashvin.me/search.png").then(
        function(response) {
          // console.log(req)
          console.log(req.hostname + "/search.png")
          var concepts = response.outputs[0].data.concepts
          var letter = concepts[0].name


          if (letter == 'a') {
            var accountId = "0cecb619-b69d-4246-ac5a-a780111887bf_d62ec0ba-6f0a-447f-a3cd-0c09211fd97a"
            return Promise.all([letter, reqq(TD_options('GET', 'accounts/' + accountId))])

          } else if (letter == 'b') {

            return Promise.all([letter, reqq(TD_options('GET', 'customers/' + initialCustomerId))])

          } else {
            return Promise.all([letter, letter])
          }
        },
        function(err) {
        }
      ).then(function(letter, resp) {
        var string = ""
        switch(letter[0]) {
          case "a":
            if (letter[1].statusCode == 200) {
              balance = letter[1].result.bankAccount.balance
              string += "You have " + balance + " dollars left in your account."
            }
            break;

          case "b":
            if (letter[1].statusCode == 200) {
              income = letter[1].result.totalIncome
              string += "Your total income is " + income + " dollars."
            }
            break;

          case"c":
            string += "You've reached C."
            break;
        }
        if (string == "") {
          string = "Something went wrong, please try again later."
        }
        res.send(letter[0].toLocaleUpperCase() + " - " + string)
        return

        // return new Promise();
      }, handleError)

      return
    })





    if (process.env.MODE == 1) {
      var options = {
    key: fs.readFileSync('./certs/privkey.pem'),
    cert: fs.readFileSync('./certs/fullchain.pem')
  };
    https.createServer(options, express_app).listen(process.env.PORT);
  } else {
    express_app.listen(3000)
  }

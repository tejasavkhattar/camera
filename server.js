#!/usr/bin/env node


TD_API_KEY = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJDQlAiLCJ0ZWFtX2lkIjoiYjk3NzY4ZmQtZTNmYi0zMTRmLWI1MTQtNDE0MDFmZGVhZmY4IiwiZXhwIjo5MjIzMzcyMDM2ODU0Nzc1LCJhcHBfaWQiOiIwY2VjYjYxOS1iNjlkLTQyNDYtYWM1YS1hNzgwMTExODg3YmYifQ.Ga1O9LoHVJzuGV_GOJtrrSBwi_MwHSrPenzvw0Vpgrg"

TD_TEAM_TOKEN = "0cecb619-b69d-4246-ac5a-a780111887bf"

initialCustomerId = "0cecb619-b69d-4246-ac5a-a780111887bf_d62ec0ba-6f0a-447f-a3cd-0c09211fd97a"

var https = require("https");
var express = require("express");
    // request = require('request');
    express_app = express();
    const multer = require('multer')
    fs = require("fs");
    require('dotenv').config()

    const util = require('util') // for printing objects
    const req = require('request-promise-native');

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
 apiKey: 'a11ec80513f94400a2caf2867db4bca6'
});

function options(method, uri, body = null) {
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

function printCustomer(resp) {
  console.log(resp)

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

      app.models.predict("production", "https://pos.dashvin.me/search.png").then(
        function(response) {
          console.log(req.hostname + "/search.png")
          var concepts = response.outputs[0].data.concepts
          var letter = concepts[0].name

          // console.log(data)
          // alert("hi")



          if (letter == a) {
            return getBalance()

          } else if (letter == b) {
          }
        },
        function(err) {
        }
      ).then()
      return
    })

    function getBalance() {
      (async () => {
        return await req(options('GET', 'accounts/' + initialCustomerId))
          .then(printCustomer, handleError)
      })();

    }




    if (process.env.MODE == 1) {
      var options = {
    key: fs.readFileSync('../pos_test/certs/pos/privkey.pem'),
    cert: fs.readFileSync('../pos_test/certs/pos/fullchain.pem')
  };
    https.createServer(options, express_app).listen(8080);
  } else {
    express_app.listen(3000)
  }

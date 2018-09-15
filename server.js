#!/usr/bin/env node

require('dotenv').config()
var https = require("https");
var express = require("express");
    express_app = express();
    const multer = require('multer')
    fs = require("fs");
    // var storage = multer.diskStorage({
    //   destination: 'public/'})

    var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/')
    },
    filename: function (req, file, cb) {
        cb(null, "search.png")
  }
})

    var upload = multer({ storage: storage })



  // var $ = require('jQuery');


const Clarifai = require('clarifai');


const app = new Clarifai.App({
 apiKey: 'a11ec80513f94400a2caf2867db4bca6'
});

    express_app.use(express.static('public'));
    express_app.use(express.static(__dirname));

    express_app.get("/", function(req, res) {
      res.sendFile(__dirname + "./index.html");
    })

    express_app.post("/file", upload.single('img'), function(req,res) {
      // var bs4 = new Buffer(fs.readFileSync("./public/search.png").toString("base64"))
      console.log("here");

      app.models.predict("production", "https://pos.dashvin.me/search.png").then(
        function(response) {
          console.log(req.hostname + "/search.png")
          var concepts = response.outputs[0].data.concepts
          console.log(concepts)
          res.send(concepts)
        },
        function(err) {
        }
      );

      return
    })

    express_app.get("/data", function(req, res)  {

      // app.models.predict("production", req.hostname + "/search.png").then(
      //   function(response) {
      //     console.log(req.hostname + "/search.png")
      //     var concepts = response.outputs[0].data.concepts
      //     console.log(concepts)
      //     res.send(concepts)
      //   },
      //   function(err) {
      //   }
      // );

    //   app.models.predict(Clarifai.GENERAL_MODEL, {base64: "G7p3m95uAl..."}).then(
    //     function(response) {
    // // do something with response
    //     },
    //     function(err) {
    // // there was an error
    //     }
    //   );
    })

    if (process.env.MODE == 1) {
      var options = {
    key: fs.readFileSync('../pos_test/certs/pos/privkey.pem'),
    cert: fs.readFileSync('../pos_test/certs/pos/fullchain.pem')
  };
    https.createServer(options, express_app).listen(8080);
  } else {
    express_app.listen(3000)
  }

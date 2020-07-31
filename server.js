"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongo = require("mongodb").MongoClient;

const fccTesting = require("./freeCodeCamp/fcctesting.js");

const app = express();

fccTesting(app); //For FCC testing purposes

app.use("/public", express.static("./public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "pug");

const dboptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

let db;

// Setup database
mongo.connect(process.env.MONGO_URI, dboptions, function(err, client) {
  if (err) console.log("Database error: " + err);
  else {
    console.log("Connected to database");
      db = client.db("nodedb");
      const auth = require("./auth");
      const routes = require("./routes");

      auth(app, db);
      routes(app, db);
  }
});
 
app.listen(process.env.PORT || 3001, () => {
  console.log("Express Server Listening on Port " + process.env.PORT || 3001);
});
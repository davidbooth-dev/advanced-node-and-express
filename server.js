"use strict";

const express = require("express");
const cors = require('cors');
//const pug = require('pug');
const path = require('path');

const fccTesting = require("./freeCodeCamp/fcctesting.js");

const app = express();
const router = express.Router();

fccTesting(app); //For FCC testing purposes

app.use("/public", express.static("./public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'pug');

app.use('/', cors(), router);

router.get('/', function(req, res){
  //Change the response to render the Pug template
  res.render(process.cwd() + '/views/pug/index', { title: 'Test Pug' });
});

router.get('/profile', function(req, res){
  //Change the response to render the Pug template
  res.render(process.cwd() + '/views/pug/profile', { title: 'profile' });
});

router.get('/login', function(req, res){
  //Change the response to render the Pug template
  res.render(process.cwd() + '/views/pug/login', { title: 'Login' });
});

router.get('/register', function(req, res){
  //Change the response to render the Pug template
  res.render(process.cwd() + '/views/pug/register', { title: 'Register' });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Listening on port " + process.env.PORT);
});

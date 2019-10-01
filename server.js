// module integrations
var mongoose = require('mongoose');
var express = require('express');
var axios = require('axios');
var cheerio = require('cheerio');
// require all models
var db = require('./models');
// express initialization
var app = express();
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);
// set port to local host 3000
var PORT = 3000;
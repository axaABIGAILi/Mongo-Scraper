// module integrations
var mongoose = require('mongoose');
var express = require('express');
var axios = require('axios');
var cheerio = require('cheerio');
// require all models
var db = require('./models');
// express initialization
var app = express();
/* MODULE INTEGRATION AND SERVER SETUP */

// module integration
const mongoose = require('mongoose');
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');
// require all models
const db = require('./models');
// express initialization
const app = express();
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);
// set port to local host 3000
var PORT = 3000;
// parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// make public a static folder
app.use(express.static('public'));

/* ROUTES */

// send users to the home page if they click the homebutton on saved.html
app.get('/', function(req, res){
    res.sendFile(path.join(__dirname+'index.html'));
});

// send users to the saved page if they navigate to /saved
app.get('/saved', function(req, res){
    res.sendFile(path.join(__dirname+'/public/saved.html'));
});

// scrape route
app.get('/scrape', function(req, res){
    // axios call to get the entire home page to be scraped
    axios.get('http://tokusatsunetwork.com/')
    .then(function(response){
        // storing cheerio into a $ variable to make reference easier
        let $ = cheerio.load(response.data);
        // create an empty array for results
        let resultArray = [];
        // grab all of the article entries off the home page
        $('li .infinite-post').each(function (i, element) {
            // for each corresponding entry, store the relevant data into an object
            let result = {};
            // title is the h2 tag
            result.title = $(element).children('h2').text();
            // category is in the mvp-main-blog-cat class
            result.category = $(element).children('h3').text();
            // url is in the a tag
            result.url = $(element).children('a').attr('href');
            // img url is in the img tag
            result.image = $(element).children('img').attr('src');
            console.log(result);
            // push object into database
            db.Article.create(result)
        })
        .then(function(dbArticle){
            console.log(dbArticle);
        })
        .catch(function(err){
            console.log(err);
        });
        });
    });

// all articles route
app.get('/articles', function(req, res){
    db.Article.find({})
    .then(function(dbArticles, err){
        if (err) { console.log(err) }
        res.json(dbArticles);
    });
});

// save route to save a particular article
app.get('/save/:id', function (req, res){
    db.Article.findOne({_id: req.params.id})
    .then(function(dbArticle){
        res.json(dbArticle);
    })
    .catch(function(err){
        console.log(err);
    });
});

// article by id route to populate particular articles with notes
app.get('/articles/:id', function (req, res){
    db.Article.findOne({_id: req.params.id})
    .populate('note')
    .then(function(dbArticle, err){
        if (err) { console.log(err) }
        res.json(dbArticle);
    });
});

// put route to update comments/notes for an article
app.post('/articles/:id', function(req, res){
    db.Comment.create(req.body)
    .then(function(dbComment, err){
        if (err) { console.log(err) }
        db.Article.findOneAndUpdate({_id: req.params.id}, {note: db.Comment._id}, {new: true});
    })
    .then (function(dbArticle, err){
        if (err) { console.log(err) }
        res.json(dbArticle);
    });
});

/* START THE SERVER */

app.listen(PORT, function(){
    console.log(`Listening on ${PORT}!`);
});
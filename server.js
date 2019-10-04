/* MODULE INTEGRATION AND SERVER SETUP */

// module integration
const mongoose = require('mongoose');
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
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
        $('.infinite-post').each(function (i, element) {
            // for each corresponding entry, store the relevant data into an object
            let result = {
                title: $(this).children('h2').text(),
                category: $(this).children('.mvp-main-blog-cat').text(),
                url: $(this).children('a').href(),
                image: $(this).children('img').attr('src')
            }
            // push object into database
            db.Article.create(result)
            .then(function(dbArticle, err){
                if (err) { console.log(err) }
                console.log(dbArticle);
            });
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
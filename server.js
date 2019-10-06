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
// used to avoid deprecation issues
mongoose.set('useFindAndModify', false);
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
app.get('/scrape', function(req, res) {
    // axios call to get the entire home page to be scraped
    axios.get('http://tokusatsunetwork.com')
    .then(function(response) {
        // storing cheerio into a $ variable to make reference easier
        let $ = cheerio.load(response.data);
        // grab all of the article entries off the home page
        $('.mvp-main-blog-text').each(function (i, element) {
            
            // for each corresponding entry, store the relevant data into an object
            let result = {};
            // title is the h2 tag
            result.title = $(element).children("p").text();

            // category is in the mvp-main-blog-cat class
            result.category = $(element).children('h3').text();
            // url is in the a tag
            result.url = $(element).children('a').attr('href');
            // img url is in the img tag
            result.image = $(element).closest('img').attr('src');
            // result.isSaved is false by default
            result.isSaved = false;
            console.log(result);
            // push object into database
            db.Article.create(result)
            .then(function(dbArticle) {
                // View the added result in the console
                console.log(dbArticle);
            })
            .catch(function(err) {
            // If an error occurred, log it
            console.log(err);
            });
        });
        res.sendFile(path.join(__dirname+'/public/index.html'));
    })
    .catch(function(err){
        console.log(err);
        res.send("Scrape error.");
    });
});

// clear route
app.get('/clear', function(req, res){
    db.Article.remove({})
    .then(function(err){
        if (err) { console.log(err) }
        res.sendFile(path.join(__dirname+'/public/index.html'));
        });
});

// all articles route
app.get('/articles', function(req, res){
    db.Article.find({})
    .then(function(dbArticles, err){
        res.json(dbArticles);
    })
    .catch(function(error){
        console.log(error);
    });
});

// save route to save a particular article
app.post('/save/:id', function (req, res){
    db.Article.findByIdAndUpdate({_id: req.params.id}, {$set :{isSaved: true}}, {new: true})
    .then(function(dbArticle){
        res.json(dbArticle);
    })
    .catch(function(err){
        console.log(err);
    });
});

// route to "delete" from saved (aka change the boolean back to unsaved)
app.put('/unsave/:id', function(req, res){
    db.Article.findByIdAndUpdate({_id: req.params.id}, 
        {isSaved: req.body.data})
    .then(function(dbArticle){
        res.json(dbArticle);
    })
    .catch(function(err){
        console.log(err);
    });
});

// article by id route to populate particular articles with comments
app.get('/articles/:id', function (req, res){
    db.Article.findOne({_id: req.params.id})
    .populate('comments')
    .then(function(dbArticle){
        console.log(dbArticle);
        res.json(dbArticle);
    })
    .catch(function(error){
        console.log(error);
    });
});

// post route to update comments/notes for an article
app.post('/articles/:id', function(req, res){
    db.Comment.create(req.body)
    .then(function(dbComment, err){
        if (err) { return err }
        db.Article.findOneAndUpdate({_id: req.params.id}, {comment: dbComment._id}, {new: true});
    })
    .then (function(dbArticle, err){
        if (err) { console.log(err) }
        res.json(dbArticle);
    })
    .catch(function(err){
        res.json(err)
    });
});

/* START THE SERVER */

app.listen(PORT, function(){
    console.log(`Listening on ${PORT}!`);
});
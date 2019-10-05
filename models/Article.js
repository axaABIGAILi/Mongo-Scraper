// mongoose integration
var mongoose = require('mongoose');
// variable for schema constructor for convenience
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    title: {
        type: String,
        required: true},
    category: {
        type: String,
        required: true},
    image: String,
    url: {
        type: String,
        required: true},
    isSaved: {
        type: Boolean,
        defualt: false,
        required: true
    }
});
// build Article model
var Article = mongoose.model('Article', ArticleSchema);
// export the article schema
module.exports = Article;
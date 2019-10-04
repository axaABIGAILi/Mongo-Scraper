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
        required: true}
});
// export the article schema
module.exports = Article;
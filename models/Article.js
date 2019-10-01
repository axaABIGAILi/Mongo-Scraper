// mongoose integration
var mongoose = require('mongoose');
// variable for schema constructor for convenience
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    headline: {
        type: String,
        required: true},
    summary: {
        type: String,
        required: true},
    photoUrl: String,
    url: {
        type: String,
        required: true}
});
// export the article schema
module.exports = Article;
// mongoose integration
var mongoose = require('mongoose');
// // variable for schema constructor for convenience
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    title: String,
    body: {
        type: String,
        required: true
    }
});
// build Comment model
var Comment = mongoose.model('Comment', CommentSchema);
// export the comment schema
module.exports = Comment;
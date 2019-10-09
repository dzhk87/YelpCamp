var mongoose = require("mongoose");

// schema setup
var commentSchema = new mongoose.Schema({
	author: String,
	text: String
});

module.exports = mongoose.model("Comment", commentSchema);

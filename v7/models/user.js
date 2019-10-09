var mongoose = require('mongoose'),
		passportLocalMongoose = require('passport-local-mongoose');

// schema setup
var userSchema = new mongoose.Schema({
	firstname: String,
	lastname: String,
	username: String,
	password: String
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);

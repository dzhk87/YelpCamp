var express = require('express'),
		router = express.Router({mergeParams: true}),
		Comment = require('../models/comment'),
		Campground = require('../models/campground');

// comment posting form
router.get('/new', isLoggedIn, function(req, res) {
	Campground.findById(req.params.id, function(err, campground) {
		if (err) {
			console.log(err);
		}else {
			res.render('comment/new', {campground: campground});
		}
	});
});

// comments post logic handling
router.post('/', isLoggedIn, function(req, res) {
	Campground.findById(req.params.id, function(err, campground) {
		if (err) {
			console.log(err);
		} else {
			Comment.create(req.body.comment, function(err, comment) {
				if (err) {
					console.log(err);
				}else {
					comment.author.id = req.user._id;
					comment.author.username = req.user.firstname;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					res.redirect('/campgrounds/' + campground._id);
				}
			});
		}
	});
});

//middleware
function isLoggedIn(req ,res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}

module.exports = router;
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
					comment.author.username = req.user.username;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					res.redirect('/campgrounds/' + campground._id);
				}
			});
		}
	});
});

//	comment EDIT route
router.get('/:commentId/edit', isLoggedIn, checkCommentOwnership, (req, res) => {
	Comment.findById(req.params.commentId, (err, foundComment) => {
		if (err) {
			console.log(err);
			res.redirect('back');
		}else {
			res.render('comment/edit', {campgroundId: req.params.id, comment: foundComment});
		}
	});
});

//	comment UPDATE route
router.put('/:commentId', isLoggedIn, checkCommentOwnership, (req, res) => {
	Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, (err, foundComment) => {
		if (err) {
			console.log(err);
		}
		res.redirect('/campgrounds/' + req.params.id);
	});
});

//	comment DELETE route
router.delete('/:commentId', isLoggedIn, checkCommentOwnership, (req, res) => {
	try {
		console.log(req.params.commentId);
		Comment.findByIdAndRemove(req.params.commentId, async (err) => {
			await Campground.findByIdAndUpdate(req.params.id, {$pull: {comments: req.params.commentId}});
		});
		res.redirect('/campgrounds/' + req.params.id);
	}catch(err) {
		console.log(err);
		res.redirect('/campgrounds/' + req.params.id);
	}
});

//middleware
function isLoggedIn(req ,res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}

function checkCommentOwnership(req, res, next) {
	Comment.findById(req.params.commentId, (err, foundComment) => {
		if(!err && foundComment.author.id.equals(req.user._id)) {
			return next();
		}else {
			res.redirect('back');
		}
	});
}

module.exports = router;
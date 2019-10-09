var express = require('express'),
		router = express.Router({mergeParams: true}),
		Comment = require('../models/comment'),
		Campground = require('../models/campground'),
		middleware = require('../middleware/');

// comment posting form
router.get('/new', middleware.isLoggedIn, (req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		if (err) {
			console.log(err);
		}else {
			res.render('comment/new', {campground: campground});
		}
	});
});

// comments post logic handling
router.post('/', middleware.isLoggedIn, (req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		if (err) {
			console.log(err);
		} else {
			Comment.create(req.body.comment, (err, comment) => {
				if (err) {
					console.log(err);
				}else {
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash('success', 'Comment has been posted!');
					res.redirect('/campgrounds/' + campground._id);
				}
			});
		}
	});
});

//	comment EDIT route
router.get('/:commentId/edit', middleware.checkCommentOwnership, (req, res) => {
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
router.put('/:commentId', middleware.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, (err, foundComment) => {
		if (err) {
			console.log(err);
		}else {
			req.flash('success', 'Comment has been updated!');
		}
		res.redirect('/campgrounds/' + req.params.id);
	});
});

//	comment DELETE route
router.delete('/:commentId', middleware.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndRemove(req.params.commentId, (err) => {
		if (err) {
			console.log(err);
		}else {
			Campground.findByIdAndUpdate(req.params.id, {$pull: {comments: req.params.commentId}});
			req.flash('success', 'Comment has been deleted!');
		}
		res.redirect('/campgrounds/' + req.params.id);
	});
});


module.exports = router;
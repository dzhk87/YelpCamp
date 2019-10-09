var express = require('express');

var Comment = require('../models/comment'),
		Campground = require('../models/campground');

const middlewareObj = {
	//
	isLoggedIn: (req, res, next) => {
		if (req.isAuthenticated()) {
			return next();
		}
		req.flash('error', 'You need to be logged in!');
		res.redirect('/login');
	},
	//
	isAlreadyLoggedIn: (req, res, next) => {
		if (!req.isAuthenticated()) {
			return next();
		}
		req.flash('error', 'You are already logged in!');
		res.redirect('/campgrounds');
	},
	//
	checkCommentOwnership: (req, res, next) => {
		if (!req.isAuthenticated()) {
			req.flash('error', 'You need to be logged in!');
			res.redirect('back');
		}
		Comment.findById(req.params.commentId, (err, foundComment) => {
			if (err || !foundComment) {
				console.log(err);
				res.redirect('back');
			}else if(foundComment.author.id.equals(req.user._id)) {
				return next();
			}
			req.flash('error', 'You are not authorized to edit/delete this comment!');
			res.redirect('back');
		})
	},
	//
	checkCampgroundOwnership: (req, res, next) => {
		if (!req.isAuthenticated()) {
			req.flash('error', 'You need to be logged in!');
			res.redirect('back');
		}
		Campground.findById(req.params.id, (err, foundCampground) => {
			if (err || !foundCampground) {
				console.log(err);
				res.redirect('back');
			}else if(foundCampground.author.id.equals(req.user._id)) {
				return next();
			}
			req.flash('error', 'You are not authorized to edit/delete this campground!');
			res.redirect('back');
		});
	}
};


module.exports = middlewareObj;
var express = require('express'),
		passport = require('passport'),
		router = express.Router(),
		User = require('../models/user'),
		Comment = require('../models/comment');

// root route
router.get('/', function(req, res) {
	res.render('home');
});

// register new
router.get('/register', function(req, res) {
	res.render('user/register');
});

// register create
router.post('/register', function(req, res) {
	User.register(new User({
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		username: req.body.username
	}), req.body.password, function(err, user) {
		if (err) {
			console.log(err);
			return res.render('user/register');
		}
		passport.authenticate('local')(req, res, function() {
			res.redirect('/campgrounds');
		});
	});
});

// show login form
router.get('/login', function(req, res) {
	res.render('user/login');
});

// login logic handling
router.post('/login', passport.authenticate('local', {
	successRedirect: '/campgrounds',
	failureRedirect: '/login',
	failureFlash: true
}));

// logout logic handling
router.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/campgrounds');
});


// middleware
function isLoggedIn(req ,res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}

module.exports = router;
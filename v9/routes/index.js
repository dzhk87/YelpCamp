var express = require('express'),
		passport = require('passport'),
		router = express.Router(),
		User = require('../models/user'),
		Comment = require('../models/comment'),
		middleware = require('../middleware/');

// root route
router.get('/', (req, res) => {
	res.render('home');
});

// register new
router.get('/register', middleware.isAlreadyLoggedIn, (req, res) => {
	res.render('user/register');
});

// register create
router.post('/register', middleware.isAlreadyLoggedIn, (req, res) => {
	User.register(new User({
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		username: req.body.username
	}), req.body.password, (err, user) => {
		if (err) {
			console.log(err);
			req.flash('error', err.message);
			res.redirect('/register');
		}
		passport.authenticate('local')(req, res, () => {
			req.flash('success', 'Welcome to YelpCamp ' + user.username + '!');
			res.redirect('/campgrounds');
		});
	});
});

// show login form
router.get('/login', middleware.isAlreadyLoggedIn, (req, res) => {
	res.render('user/login');
});

// login logic handling
router.post('/login', passport.authenticate('local', {
	successRedirect: '/campgrounds',
	failureRedirect: '/login',
	successFlash: true,
	failureFlash: true,
	successFlash: 'Successfully logged in',
	failureFlash: 'Incorrect username or password'
}));

// logout logic handling
router.get('/logout', (req, res) => {
	req.logout();
	req.flash('success', 'Successfully logged out!');
	res.redirect('back');
});

module.exports = router;
var express = require('express'),
		router = express.Router(),
		Campground = require('../models/campground');

// INDEX ROUTE
router.get('/', function(req,res) {
	// get all campgrounds
	Campground.find({}, function(err, dbCampgrounds) {
		if (err) {
			console.log(err);
		}else {
			res.render('campground/index', {campgrounds: dbCampgrounds});
		}
	});
});

//  NEW ROUTE
router.get('/new', isLoggedIn, function(req, res) {
	res.render('campground/new');
});

// CREATE ROUTE
router.post('/', isLoggedIn, function(req, res) {
	// get data from form and add it to the array
	// res.send('campgrounds post route')
	var name = req.body.name;
	var img = req.body.img;
	var desc = req.body.desc;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {name: name, image: img, description: desc, author: author}
	Campground.create(newCampground, function(err, newlyCreated) {
		if (err) {
			console.log(err);
			res.redirect('campground/new');
		}else {
			console.log(newlyCreated);
			console.log(newlyCreated.name + ' has been added to the campground database');
		}
	});
	res.redirect('/campgrounds');
});

//  SHOW ROUTE
router.get('/:id', function(req, res) {
	var campgroundId = req.params.id;
	Campground.findById(campgroundId).populate('comments').exec(function(err, campground) {
		if (err) {
			console.log(err);
			res.redirect('/campgrounds');
		}else {
			res.render('campground/show', {campground: campground});
		}
	});
});

// middleware
function isLoggedIn(req ,res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}

module.exports = router;

var express = require('express'),
		router = express.Router(),
		Campground = require('../models/campground'),
		Comment = require('../models/comment');

// INDEX ROUTE
router.get('/', (req, res) => {
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
router.get('/new', isLoggedIn, (req, res) => {
	res.render('campground/new');
});

// CREATE ROUTE
router.post('/', isLoggedIn, (req, res) => {
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
			console.log(newlyCreated.name + ' has been added to the campground database');
		}
	});
	res.redirect('/campgrounds');
});

//  SHOW ROUTE
router.get('/:id', (req, res) => {
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

//	EDIT ROUTE
router.get('/:id/edit', isLoggedIn, checkOwnership, (req, res) => {
	Campground.findById(req.params.id, function(err, foundCampground) {
		if (err) {
			console.log('err');
			res.redirect('/');
		}else {
			res.render('campground/edit', {campground: foundCampground});
		}
	});
});

//	UPDATE ROUTE
router.put('/:id', isLoggedIn, checkOwnership, (req, res) => {
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
		if (err) {
			res.redirect('/campgrounds/');
		}else {
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
});

//	DESTROY ROUTE
router.delete('/:id', isLoggedIn, checkOwnership, (req, res) => {
	try {
		Campground.findByIdAndRemove(req.params.id, async (err, deletedCampground) => {
			await Comment.deleteMany({_id: { $in: deletedCampground.comments }});
		});
		res.redirect('/campgrounds');
	}catch(err) {
		console.log(err);
		res.redirect('/campgrounds');
	}
});

// middleware
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}

function checkOwnership(req, res, next) {
	Campground.findById(req.params.id, (err, foundCampground) => {
		if(!err && foundCampground.author.id.equals(req.user._id)) {
			return next();
		}else {
			res.redirect('back');
		}
	});
}

module.exports = router;



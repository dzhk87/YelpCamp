var express = require('express'),
		router = express.Router(),
		Campground = require('../models/campground'),
		Comment = require('../models/comment'),
		middleware = require('../middleware');

// INDEX ROUTE
router.get('/', (req, res) => {
	// get all campgrounds
	Campground.find({}, (err, dbCampgrounds) => {
		if (err) {
			console.log(err);
			res.redirect('/');
		}else {
			res.render('campground/index', {campgrounds: dbCampgrounds});
		}
	});
});

//  NEW ROUTE
router.get('/new', middleware.isLoggedIn, (req, res) => {
	res.render('campground/new');
});

// CREATE ROUTE
router.post('/', middleware.isLoggedIn, (req, res) => {
	// get data from form and add it to the array
	// res.send('campgrounds post route')
	var name = req.body.name;
	var price = req.body.price;
	var img = req.body.img;
	var desc = req.body.desc;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {name: name, image: img, price: price, description: desc, author: author}
	Campground.create(newCampground, (err, newlyCreated) => {
		if (err) {
			console.log(err);
			res.redirect('campground/new');
		}else {
			req.flash('success', newlyCreated.name + 'has been added to the campground database!');
			console.log(newlyCreated.name + ' has been added to the campground database');
		}
	});
	res.redirect('/campgrounds');
});

//  SHOW ROUTE
router.get('/:id', (req, res) => {
	var campgroundId = req.params.id;
	Campground.findById(campgroundId).populate('comments').exec((err, campground) => {
		if (err) {
			console.log(err);
			res.redirect('/campgrounds');
		}else if (!campground) {
			req.flash('error', 'Campground not found');
			res.redirect('/campgrounds');
		}else {
			res.render('campground/show', {campground: campground});
		}
	});
});

//	EDIT ROUTE
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
	Campground.findById(req.params.id, (err, foundCampground) => {
		if (err) {
			console.log('err');
			res.redirect('/campgrounds');
		}else if (!foundCampground) {
			req.flash('error', 'Campground not found');
			res.redirect('/campgrounds');
		}else {
			res.render('campground/edit', {campground: foundCampground});
		}
	});
});

//	UPDATE ROUTE
router.put('/:id', middleware.checkCampgroundOwnership, (req, res) => {
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
		if (err) {
			console.log(err);
		}else {
			req.flash('success', updatedCampground.name + ' has been updated!');
		}
		res.redirect('/campgrounds/' + req.params.id);
	});
});

//	DESTROY ROUTE
router.delete('/:id', middleware.checkCampgroundOwnership, (req, res) => {
	Campground.findByIdAndRemove(req.params.id, (err, deletedCampground) => {
		if (err) {
			console.log(err);
		}else {
			Comment.deleteMany({_id: { $in: deletedCampground.comments }});
			req.flash('success', deletedCampground.name + ' has been removed from the campground database');
		}
		res.redirect('/campgrounds');
	});
});


module.exports = router;



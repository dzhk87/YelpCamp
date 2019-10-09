var express = require('express'),
		app = express(),
		bodyParser = require('body-parser'),
		mongoose = require('mongoose'),
		passport = require('passport'),
		passportLocal = require('passport-local'),
		passportLocalMongoose = require('passport-local-mongoose'),
		flash = require('connect-flash'),
		Campground = require('./models/campground'),
		Comment = require('./models/comment'),
		User = require('./models/user');

		// seedDB = require('./seeds'),

// seedDB();
mongoose.connect('mongodb://localhost/yelp_camp', {useNewUrlParser: true, useUnifiedTopology: true});
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+'/public'));
app.use(require('express-session')({
	secret: 'Passport configuration',
	resave: false,
	saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	next();
});

passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//////////////////////////////////////////////
/////////////////// ROUTES ///////////////////
//////////////////////////////////////////////

// homepage
app.get('/', function(req, res) {
	res.render('home');
});

/////////////////
// INDEX ROUTE // -> displays all campgrounds
/////////////////
app.get('/campgrounds', function(req,res) {
	// get all campgrounds
	Campground.find({}, function(err, dbCampgrounds) {
		if (err) {
			console.log(err);
		}else {
			res.render('campground/index', {campgrounds: dbCampgrounds});
		}
	});
});

/////////////////
//  NEW ROUTE  // -> displays the form to create a campground
/////////////////
app.get('/campgrounds/new', isLoggedIn, function(req, res) {
	res.render('campground/new');
});

//////////////////
// CREATE ROUTE // -> adds new campground to the database
//////////////////
app.post('/campgrounds', isLoggedIn, function(req, res) {
	// get data from form and add it to the array
	// res.send('campgrounds post route')
	var name = req.body.name;
	var img = req.body.img;
	var desc = req.body.desc;
	var newCampground = {name: name, image: img, description: desc};
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

//////////////////
//  SHOW ROUTE  // -> displays the info of one specific campground
//////////////////
app.get('/campgrounds/:id', function(req, res) {
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

//==========================
//    COMMENT ROUTES
//==========================

app.get('/campgrounds/:id/comments/new', isLoggedIn, function(req, res) {
	Campground.findById(req.params.id, function(err, campground) {
		if (err) {
			console.log(err);
		}else {
			res.render('comment/new', {campground: campground});
		}
	});
});

app.post('/campgrounds/:id/comments', isLoggedIn, function(req, res) {
	Campground.findById(req.params.id, function(err, campground) {
		if (err) {
			console.log(err);
		} else {
			Comment.create(req.body.comment, function(err, comment) {
				if (err) {
					console.log(err);
				}else {
					campground.comments.push(comment);
					campground.save();
					res.redirect('/campgrounds/' + campground._id);
				}
			});
		}
	});
});

//===================================
//       AUTHENTICATION ROUTES
//===================================
app.get('/register', function(req, res) {
	res.render('user/register');
});

app.post('/register', function(req, res) {
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

app.get('/login', function(req, res) {
	res.render('user/login');
});


app.post('/login', passport.authenticate('local', {
	successRedirect: '/campgrounds',
	failureRedirect: '/login',
	failureFlash: true
}));

app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/campgrounds');
});

function isLoggedIn(req ,res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}

app.listen(3000, function() {
	console.log('YelpCamp Server has initiated');
});

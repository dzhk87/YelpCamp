var express = require('express'),
		app = express(),
		bodyParser = require('body-parser'),
		mongoose = require('mongoose'),
		flash = require('connect-flash'),
		passport = require('passport'),
		passportLocal = require('passport-local'),
		passportLocalMongoose = require('passport-local-mongoose'),
		methodOverride = require('method-override'),
		Campground = require('./models/campground'),
		Comment = require('./models/comment'),
		User = require('./models/user');

var indexRoutes = require('./routes/index'),
		commentRoutes = require('./routes/comments'),
		campgroundRoutes = require('./routes/campgrounds');

// seedDB = require('./seeds'),
// seedDB();

mongoose.connect('mongodb://localhost/yelp_camp', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
app.use(methodOverride('_method'));
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
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});
app.use(indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);


passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.listen(3000, function() {
	console.log('YelpCamp Server has initiated');
});

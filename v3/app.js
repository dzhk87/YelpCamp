var express = require("express"),
		app = express(),
		bodyParser = require("body-parser"),
		mongoose = require("mongoose"),
		Campground = require("./models/campground"),
		Comment = require("./models/comment"),
		seedDB = require("./seeds");

seedDB();
mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true});
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// homepage
app.get("/", function(req, res) {
	res.render("home");
});

/////////////////
// INDEX ROUTE // -> displays all campgrounds
/////////////////
app.get("/campgrounds", function(req,res) {
	// get all campgrounds
	Campground.find({}, function(err, dbCampgrounds) {
		if (err) {
			console.log(err);
		}else {
			res.render("index", {campgrounds: dbCampgrounds});
		}
	});
});

//////////////////
// CREATE ROUTE // -> adds new campground to the database
//////////////////
app.post("/campgrounds", function(req, res) {
	// get data from form and add it to the array
	// res.send("campgrounds post route")
	var name = req.body.name;
	var img = req.body.img;
	var desc = req.body.desc;
	var newCampground = {name: name, image: img, description: desc};
	Campground.create(newCampground, function(err, newlyCreated) {
		if (err) {
			console.log(err);
			res.redirect("/campgrounds/new");
		}else {
			console.log(newlyCreated.name + " has been added to the campground database");
		}
	});
	res.redirect("/campgrounds");
});

/////////////////
//  NEW ROUTE  // -> displays the form to create a campground
/////////////////
app.get("/campgrounds/new", function(req, res) {
	res.render("new");
});

//////////////////
//  SHOW ROUTE  // -> displays the info of one specific campground
//////////////////
app.get("/campgrounds/:id", function(req, res) {
	var campgroundId = req.params.id;
	Campground.findById(campgroundId).populate("comments").exec(function(err, campground) {
		if (err) {
			res.redirect("/campgrounds");
			console.log(err);
		}else {
			res.render("show", {campground: campground});
		}
	});
});


app.listen(3000, function() {
	console.log("YelpCamp Server has initiated");
});

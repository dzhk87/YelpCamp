var express = require("express");
var app = express();
var bodyParser = require("body-parser");

var campgrounds = [
	{name: "Tobermory", image: "https://cdn.pixabay.com/photo/2016/02/18/22/16/tent-1208201_1280.jpg"},
	{name: "Killbear", image: "https://cdn.pixabay.com/photo/2016/11/22/23/08/adventure-1851092_1280.jpg"},
	{name: "Grand Bend", image: "https://cdn.pixabay.com/photo/2017/08/17/08/08/camp-2650359_1280.jpg"},
	{name: "Tobermory", image: "https://cdn.pixabay.com/photo/2016/02/18/22/16/tent-1208201_1280.jpg"},
	{name: "Killbear", image: "https://cdn.pixabay.com/photo/2016/11/22/23/08/adventure-1851092_1280.jpg"},
	{name: "Grand Bend", image: "https://cdn.pixabay.com/photo/2017/08/17/08/08/camp-2650359_1280.jpg"},
	{name: "Tobermory", image: "https://cdn.pixabay.com/photo/2016/02/18/22/16/tent-1208201_1280.jpg"},
	{name: "Killbear", image: "https://cdn.pixabay.com/photo/2016/11/22/23/08/adventure-1851092_1280.jpg"},
	{name: "Grand Bend", image: "https://cdn.pixabay.com/photo/2017/08/17/08/08/camp-2650359_1280.jpg"}
];

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/", function(req, res) {
	res.render("homepage");
});

app.get("/campgrounds", function(req,res) {
	res.render("campgrounds", {campgrounds: campgrounds});
});

app.post("/campgrounds", function(req, res) {
	// get data from form and add it to the array
	// res.send("campgrounds post route")
	var name = req.body.name;
	var img = req.body.img;
	var newCampground = {name: name, image: img};
	campgrounds.push(newCampground);
	res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res) {
	res.render("new");
});

app.listen(3000, function() {
	console.log("YelpCamp Server has initiated");
});
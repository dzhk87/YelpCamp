var mongoose = require("mongoose"),
		Campground = require("./models/campground"),
		Comment = require("./models/comment");

var seeds = [
	{
		name: "Buntzen Lake",
		image: "http://www.anmorecamp-rv.ca/wp-content/uploads/2018/04/Dock-0604.jpg",
		description: "Nulla faucibus vitae tellus eleifend interdum. Praesent venenatis quam ac ligula rutrum dapibus. Duis massa ipsum, suscipit id libero vel, gravida hendrerit mauris. Etiam vel molestie turpis. Integer vel dolor in libero ullamcorper rutrum sed quis mauris. Cras vulputate tellus pulvinar, laoreet nisi in, euismod turpis. Mauris vitae sapien nibh. Quisque consectetur magna risus, ac elementum nulla fermentum in. Praesent tempor ex quam, vel commodo est hendrerit in."
	},
	{
		name: "Wya Point",
		image: "https://www.planetware.com/wpimages/2018/06/british-columbia-vancouver-island-campgrounds-wya-point-beach.jpg",
		description: "Proin blandit placerat felis vitae ullamcorper. Suspendisse congue malesuada ante ut viverra. Fusce scelerisque elit sit amet augue aliquam tincidunt. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Vivamus vitae elit ut urna ullamcorper suscipit. Quisque ornare lacus ac tortor suscipit rutrum. Mauris vestibulum tellus at elementum dapibus. Duis purus ligula, vulputate sit amet lobortis tempus, tincidunt id orci. Vestibulum a ultricies quam. Nullam eu volutpat orci, vitae venenatis nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Suspendisse id condimentum nunc."
	},
	{
		name: "Rathtrevor Provincial Park",
		image: "https://www.planetware.com/wpimages/2018/06/british-columbia-vancouver-island-campgrounds-rathtrevor-provincial-park.jpg",
		description: "Nullam eu felis eleifend, viverra erat interdum, eleifend nisl. Mauris eu dictum orci. Sed eu lorem eros. In dignissim mauris quis sapien porttitor egestas. Maecenas gravida commodo dolor sit amet pulvinar. Suspendisse ut dictum orci, ac commodo neque. Mauris molestie eros nec ligula fringilla aliquet. Sed ultrices mi finibus, feugiat magna luctus, convallis felis."
	},
	{
		name: "Goldstream Provincial Park",
		image: "https://www.planetware.com/wpimages/2018/06/british-columbia-vancouver-island-campgrounds-goldstream-provincial-park-waterfall.jpg",
		description: "Nullam ac ex erat. Duis dapibus at risus nec mollis. Sed mattis maximus odio. Sed ac nisl tortor. Quisque et volutpat purus. Suspendisse sit amet semper erat. Etiam volutpat cursus maximus. Nulla laoreet laoreet diam, vel hendrerit ante ultrices ut. Donec id suscipit lacus."
	}
];

async function seedDB() {
	try {
		// remove all campgrounds and comments
		await Campground.deleteMany();
		await Comment.deleteMany();
		// generates campgrounds
		for (const seed of seeds) {
			let campground = await Campground.create(seed);
			campground.save();
		}
	} catch(err) {
		console.log(err);
	}
};

module.exports = seedDB;
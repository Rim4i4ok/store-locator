const mongoose = require("mongoose");
const geocoder = require("../utils/geocoder");

const StoreSchema = new mongoose.Schema({
	storeId: {
		type: String,
		required: [true, "Please add a store ID"],
		unique: true,
		trim: true,
		maxlength: [10, "Store ID must be less than 10 chars"],
	},
	address: {
		type: String,
		required: [true, "Please add an address"],
	},
	location: {
		type: {
			type: String, // Don't do `{ location: { type: String } }`
			enum: ["Point"], // 'location.type' must be 'Point'
		},
		coordinates: {
			type: [Number],
			index: "2dsphere",
		},
		formattedAddress: String,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

// geocode and create location
StoreSchema.pre("save", async function(next) {
	const location = await geocoder.geocode(this.address);
	this.location = {
		type: "Point",
		coordinates: [location[0].longitude, location[0].latitude],
		formattedAddress: location[0].formattedAddress,
	};

	// do not save address
	this.address = undefined;
	next();
});

module.exports = mongoose.model("Store", StoreSchema);

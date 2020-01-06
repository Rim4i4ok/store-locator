const Store = require("../models/Store");

// @desc Get all stores
// @route GET /api/v1/stores
// @access Public
exports.getStore = async (req, res, next) => {
	try {
		const stores = await Store.find();

		return res.status(200).json({
			success: true,
			count: stores.length,
			data: stores,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Server error" });
	}
};

// @desc Create a stores
// @route POST /api/v1/stores
// @access Public
exports.addStore = async (req, res, next) => {
	try {
		// console.log(req.body);
		const store = await Store.create(req.body);

		return res.status(200).json({
			success: true,
			data: store,
		});
	} catch (error) {
		console.error(error);
		if (error.code === 11000) {
			return res.status(400).json({ error: "This store already exists" });
		}
		res.status(500).json({ error: "Server error" });
	}
};

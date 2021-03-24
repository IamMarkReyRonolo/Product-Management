const mongoose = require("mongoose");

const accoutSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	productName: {
		type: String,
	},
	accountName: {
		type: String,
		unique: true,
	},
	accountType: {
		type: String,
		enum: ["Solo", "Shared"],
	},
	accountCredentials: {
		username: {
			type: String,
		},
		password: {
			type: String,
		},
	},
	originalPrice: {
		type: Number,
	},
	sellingPrice: {
		type: Number,
	},
	datePurchased: {
		type: Date,
	},
	dateExpires: {
		type: Date,
	},
	customers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Customer" }],
});

module.exports = mongoose.model("Account", accoutSchema);

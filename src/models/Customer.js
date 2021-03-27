const mongoose = require("mongoose");

const customerSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: {
		firstName: {
			type: String,
		},
		lastName: {
			type: String,
		},
	},
	phone: {
		type: String,
	},
	facebook: {
		type: String,
	},
	accounts: [
		{
			account: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
			pin: Number,
			subscriptionPrice: Number,
			subscriptionPurchased: Date,
			subscriptionExpires: Date,
		},
	],
});

module.exports = mongoose.model("Customer", customerSchema);

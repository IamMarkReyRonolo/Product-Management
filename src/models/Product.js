const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: {
		type: String,
		required: true,
	},
	accounts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Account" }],
});

module.exports = mongoose.model("Product", productSchema);

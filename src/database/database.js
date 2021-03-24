const mongoose = require("mongoose");

mongoose
	.connect(process.env.DB_CONNECTION, {
		useUnifiedTopology: true,
		useNewUrlParser: true,
		useFindAndModify: false,
	})
	.then(() => {
		console.log("Connected to database");
	})
	.catch((err) => {
		console.log("There is a problem connecting to database.");
	});

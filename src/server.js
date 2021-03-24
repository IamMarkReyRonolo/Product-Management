const express = require("express");
const cors = require("cors");
require("dotenv/config");

const app = express();

// MIDDLEWARES
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// CONNECT TO DATABASE
require("./database/database");

// ROUTER
const productsAPI = require("./api/product");
const accountsAPI = require("./api/account");
const customersAPI = require("./api/customer");

app.use("/api/products", productsAPI);
app.use("/api", accountsAPI);
app.use("/api", customersAPI);

// ERROR HANDLING
app.use((req, res, next) => {
	const error = new Error("Error. Not Found");
	error.status = 404;
	next(error);
});

app.use((error, req, res, next) => {
	error.status = error.status || 500;
	res.json(error.message);
});

// LISTEN
app.listen(process.env.PORT || 3000, () => {
	console.log("Server is running");
});

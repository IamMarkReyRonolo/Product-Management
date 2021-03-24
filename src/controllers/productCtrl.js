const Product = require("../models/Product");
const mongoose = require("mongoose");

const getAllProducts = (req, res, next) => {
	Product.find({}, (err, products) => {
		if (err) {
			next(err);
		} else {
			res.status(200).json({ count: products.length, result: products });
		}
	});
};

const getSpecificProduct = (req, res, next) => {
	Product.findById(req.params.productId, (err, product) => {
		if (err) {
			next(err);
		} else {
			if (product) {
				res.status(200).json({ product: product });
			} else {
				const error = new Error("Not found");
				error.status = 404;
				next(error);
			}
		}
	});
};

const addProduct = (req, res, next) => {
	const product = new Product({
		_id: mongoose.Types.ObjectId(),
		name: req.body.name,
	});

	product
		.save()
		.then((result) => {
			res.status(201).json({ message: "Success", product: result });
		})
		.catch((err) => {
			next(err);
		});
};

const updateProduct = (req, res, next) => {
	Product.findById(
		req.params.productId,
		{ name: req.body.name },
		{ new: true },
		(err, product) => {
			if (err) {
				next(err);
			} else {
				if (product) {
					res.status(201).json({
						message: "Succesfully updated product.",
						product: product,
					});
				} else {
					const error = new Error("Not found");
					error.status = 404;
					next(error);
				}
			}
		}
	);
};

const deleteProduct = (req, res, next) => {
	Product.findByIdAndDelete(req.params.productId, (err, product) => {
		if (err) {
			next(err);
		} else {
			res.status(200).json({ message: "Succesfully deleted product." });
		}
	});
};

module.exports = {
	getAllProducts,
	getSpecificProduct,
	addProduct,
	updateProduct,
	deleteProduct,
};

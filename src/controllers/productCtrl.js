const Product = require("../models/Product");
const mongoose = require("mongoose");

const getAllProducts = (req, res, next) => {
	Product.find({}, (err, products) => {
		if (err) {
			next(err);
		} else {
			res.status(200).json({
				count: products.length,
				products,
			});
		}
	});
};

const getSpecificProduct = (req, res, next) => {
	Product.findById(req.params.productId, (err, product) => {
		if (err) {
			next(err);
		} else {
			if (!product) {
				const error = new Error("Not found");
				error.status = 404;
				next(error);
			}
		}
	})
		.populate("accounts")
		.exec((err, product) => {
			if (err) {
				next(err);
			} else {
				res.status(200).json({
					id: product._id,
					name: product.name,
					accounts: {
						count: product.accounts.length,
						accounts: product.accounts,
					},
				});
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
			res.status(201).json({
				message: "Success",
				product: {
					id: product._id,
					name: product.name,
					accounts: {
						count: product.accounts.length,
						accounts: product.accounts,
					},
				},
			});
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
						product: {
							id: product._id,
							name: product.name,
							accounts: {
								count: product.accounts.length,
								accounts: product.accounts,
							},
						},
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

const mongoose = require("mongoose");
const Account = require("../models/Account");
const Product = require("../models/Product");

const getSpecificAccount = (req, res, next) => {
	Account.findById(req.params.accountId, (err, account) => {
		if (err) {
			next(err);
		} else {
			if (account) {
				console.log(account);
				res.status(200).json(account);
			} else {
				const error = new Error("Not Found");
				error.status = 404;
				next(error);
			}
		}
	});
};

const addAccount = (req, res, next) => {
	Product.findById(req.params.product_id, (error, product) => {
		if (error) {
			next(error);
		} else {
			if (product) {
				console.log(product);
				const account = new Account({
					_id: mongoose.Types.ObjectId(),
					productName: product.name,
					accountName: req.body.accountName,
					accountType: req.body.accountType,
					accountCredentials: {
						username: req.body.accountCredentials.username,
						password: req.body.accountCredentials.password,
					},
					originalPrice: req.body.originalPrice,
					sellingPrice: req.body.sellingPrice,
					datePurchased: new Date(req.body.datePurchased),
					dateExpires: new Date(req.body.dateExpires),
					customers: req.body.customers,
				});
				console.log(account._id);

				account
					.save()
					.then((result) => {
						product.accounts.push(account);

						Product.findByIdAndUpdate(
							product._id,
							{ accounts: product.accounts },
							{ new: true },
							(err, result) => {
								if (err) {
									next(err);
								} else {
									res.status(201).json(result);
								}
							}
						);
					})
					.catch((err) => {
						next(err);
					});
			} else {
				const error = new Error("Not found");
				error.status = 404;
				next(error);
			}
		}
	});
};

const updateAccount = async (req, res, next) => {
	try {
		await Account.findOne(
			{ _id: req.params.accountId },
			req.body,
			{ upsert: true },
			(err, account) => {
				if (err) {
					next(err);
				} else {
					res.status(200).json(account);
				}
			}
		);
	} catch (err) {
		next(err);
	}
};

const deleteAccount = (req, res, next) => {
	Account.findByIdAndDelete(req.params.accountId, (err, account) => {
		if (err) {
			next(err);
		} else {
			if (product) {
				res.status(200).json({ message: "Succesfully deleted account" });
			} else {
				const error = new Error("Not Found");
				error.status = 404;
				next(error);
			}
		}
	});
};

module.exports = {
	getSpecificAccount,
	addAccount,
	updateAccount,
	deleteAccount,
};

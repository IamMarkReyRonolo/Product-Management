const e = require("express");
const mongoose = require("mongoose");
const Account = require("../models/Account");
const Product = require("../models/Product");

const getSpecificAccount = (req, res, next) => {
	Account.findById(req.params.accountId, (err, account) => {
		if (err) {
			next(err);
		} else {
			if (!account) {
				const error = new Error("Not Found");
				error.status = 404;
				next(error);
			}
		}
	})
		.populate("customers")
		.exec((err, account) => {
			if (err) {
				next(err);
			} else {
				res.status(200).json({
					account: {
						id: account._id,
						productName: account.productName,
						accountName: account.accountName,
						accountType: account.accountType,
						accountCredentials: account.accountCredentials,
						originalPrice: account.originalPrice,
						sellingPrice: account.sellingPrice,
						datePurchased: account.datePurchased,
						dateExpires: account.dateExpires,
						customers: {
							count: account.customers.length,
							customers: account.customers,
						},
					},
				});
			}
		});
};

const addAccount = async (req, res, next) => {
	try {
		const product = await Product.findById(req.params.product_id);
		if (product) {
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

			account
				.save()
				.then(async (result) => {
					product.accounts.push(account);

					const savedProduct = await product.save();
					res.status(201).json({
						message: "Successfully added account",
						account: {
							id: account._id,
							productName: account.productName,
							accountName: account.accountName,
							accountType: account.accountType,
							accountCredentials: account.accountCredentials,
							originalPrice: account.originalPrice,
							sellingPrice: account.sellingPrice,
							datePurchased: account.datePurchased,
							dateExpires: account.dateExpires,
							customers: {
								count: account.customers.length,
								customers: account.customers,
							},
						},
					});
				})
				.catch((err) => {
					next(err);
				});
		} else {
			const error = new Error("Not found");
			error.status = 404;
			next(error);
		}
	} catch (err) {
		next(err);
	}
};

//
// const addAccount = (req, res, next) => {
// 	Product.findById(req.params.product_id, (error, product) => {
// 		if (error) {
// 			next(error);
// 		} else {
// 			if (product) {
// 				const account = new Account({
// 					_id: mongoose.Types.ObjectId(),
// 					productName: product.name,
// 					accountName: req.body.accountName,
// 					accountType: req.body.accountType,
// 					accountCredentials: {
// 						username: req.body.accountCredentials.username,
// 						password: req.body.accountCredentials.password,
// 					},
// 					originalPrice: req.body.originalPrice,
// 					sellingPrice: req.body.sellingPrice,
// 					datePurchased: new Date(req.body.datePurchased),
// 					dateExpires: new Date(req.body.dateExpires),
// 					customers: req.body.customers,
// 				});

// 				account
// 					.save()
// 					.then((result) => {
// 						product.accounts.push(result);

// 						Product.findByIdAndUpdate(
// 							product._id,
// 							{ accounts: product.accounts },
// 							{ new: true },
// 							(err, result) => {
// 								if (err) {
// 									next(err);
// 								} else {
// 									res.status(201).json({
// 										message: "Successfully added account",
// 										account: {
// 											id: account._id,
// 											productName: account.productName,
// 											accountName: account.accountName,
// 											accountType: account.accountType,
// 											accountCredentials: account.accountCredentials,
// 											originalPrice: account.originalPrice,
// 											sellingPrice: account.sellingPrice,
// 											datePurchased: account.datePurchased,
// 											dateExpires: account.dateExpires,
// 											customers: {
// 												count: account.customers.length,
// 												customers: account.customers,
// 											},
// 										},
// 									});
// 								}
// 							}
// 						);
// 					})
// 					.catch((err) => {
// 						next(err);
// 					});
// 			} else {
// 				const error = new Error("Not found");
// 				error.status = 404;
// 				next(error);
// 			}
// 		}
// 	});
// };

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
					res.status(200).json({
						message: "Sucessfullt updated account.",
						account: {
							id: account._id,
							productName: account.productName,
							accountName: account.accountName,
							accountType: account.accountType,
							accountCredentials: account.accountCredentials,
							originalPrice: account.originalPrice,
							sellingPrice: account.sellingPrice,
							datePurchased: account.datePurchased,
							dateExpires: account.dateExpires,
							customers: account.customers,
						},
					});
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

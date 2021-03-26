const mongoose = require("mongoose");

const Customer = require("../models/Customer");
const Account = require("../models/Account");

const getAllCustomers = (req, res, next) => {
	Customer.find({}, (err, customers) => {
		if (err) {
			next(err);
		} else {
			if (customers) {
				res.status(200).json({ count: customers.length, result: customers });
			} else {
				const error = new Error("Not Found");
				error.status = 404;
				next(error);
			}
		}
	});
};

const getSpecificCustomer = (req, res, next) => {
	Customer.findById(req.params.customerId, (err, customer) => {
		if (err) {
			next(err);
		} else {
			if (!customer) {
				const error = new Error("Not Found");
				error.status = 404;
				next(error);
			}
		}
	})
		.populate("accounts.account")
		.exec((err, customer) => {
			if (err) {
				next(err);
			} else {
				res.status(200).json({
					id: customer._id,
					name: customer.name,
					phone: customer.phone,
					facebook: customer.facebook,
					accounts: {
						count: customer.accounts.length,
						accounts: customer.accounts,
					},
				});
			}
		});
};

const addCustomer = async (req, res, next) => {
	try {
		const account = await Account.findById(req.params.accountId);
		if (account) {
			const customer = Customer({
				name: req.body.name,
				phone: req.body.phone,
				facebook: req.body.facebook,
			});
			customer._id = mongoose.Types.ObjectId();

			const acc = {
				account: account,
				pin: req.body.pin,
				subscriptionPurchased: new Date(req.body.subscriptionPurchased),
				subscriptionExpires: new Date(req.body.subscriptionExpires),
			};
			customer.accounts.push(acc);
			customer
				.save()
				.then((result) => {
					account.customers.push(customer);
					account.save().then((result) => {
						res.status(201).json({
							message: "Successfully added customer",
							customer: {
								id: customer._id,
								name: customer.name,
								phone: customer.phone,
								facebook: customer.facebook,
								accounts: customer.accounts,
							},
						});
					});
				})
				.catch((err) => {
					next(err);
				});
		} else {
			const error = new Error("Not Found");
			error.status = 404;
			next(error);
		}
	} catch (err) {
		next(err);
	}
};

const updateCustomer = (req, res, next) => {
	Customer.findByIdAndUpdate(
		req.params.customerId,
		req.body,
		{ upsert: true },
		(err, customer) => {
			if (err) {
				next(err);
			} else {
				if (customer) {
					res.status(200).json({
						message: "Successfully updated customer",
						customer: {
							id: customer._id,
							name: customer.name,
							phone: customer.phone,
							facebook: customer.facebook,
							accounts: customer.accounts,
						},
					});
				} else {
					const error = new Error("Not Found");
					error.status = 404;
					next(error);
				}
			}
		}
	);
};

const deleteCustomer = (req, res, next) => {
	Customer.findByIdAndDelete(req.params.customerId, (err, customer) => {
		if (err) {
			next(err);
		} else {
			if (customer) {
				res.status(200).json({ message: "Successfully deleted customer" });
			} else {
				const error = new Error("Not Found");
				error.status = 404;
				next(error);
			}
		}
	});
};

module.exports = {
	getAllCustomers,
	getSpecificCustomer,
	addCustomer,
	updateCustomer,
	deleteCustomer,
};

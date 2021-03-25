const mongoose = require("mongoose");

const Customer = require("../models/Customer");
const Account = require("../models/Account");

const getAllCustomers = (req, res, next) => {
	console.log("yow");
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
			if (customer) {
				res.status(200).json(customer);
			} else {
				const error = new Error("Not Found");
				error.status = 404;
				next(error);
			}
		}
	});
};

const addCustomer = async (req, res, next) => {
	try {
		const account = await Account.findById(req.params.accountId);
		if (account) {
			const customer = Customer(req.body);
			customer._id = mongoose.Types.ObjectId();
			customer.accounts.push(account);
			customer
				.save()
				.then((result) => {
					account.customers.push(customer);
					account.save().then((result) => {
						res.status(201).json(result);
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

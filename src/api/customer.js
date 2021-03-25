const express = require("express");
const customerCtrl = require("../controllers/customerCtrl");
const app = express.Router();

// GET
app.get("/customers", customerCtrl.getAllCustomers);
app.get("/customers/:customerId", customerCtrl.getSpecificCustomer);

// POST
app.post("/:accountId/customers", customerCtrl.addCustomer);

// UPDATE
app.patch("/customers/:customerId", customerCtrl.updateCustomer);

// DELETE
app.delete("/customers/:customerId", customerCtrl.deleteCustomer);
module.exports = app;

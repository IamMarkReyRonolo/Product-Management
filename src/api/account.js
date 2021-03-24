const express = require("express");
const accountCtrl = require("../controllers/accountCtrl");

const app = express.Router();

// GET
app.get("/accounts/:accountId", accountCtrl.getSpecificAccount);

// POST
app.post("/:product_id/accounts", accountCtrl.addAccount);

// UPDATE
app.patch("/accounts/:accountId", accountCtrl.updateAccount);

// DELETE
app.delete("/accounts/:accountId", accountCtrl.deleteAccount);

module.exports = app;

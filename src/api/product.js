const express = require("express");
const productCtrl = require("../controllers/productCtrl");

const app = express.Router();

// GET
app.get("/", productCtrl.getAllProducts);
app.get("/:productId", productCtrl.getSpecificProduct);

// POST
app.post("/", productCtrl.addProduct);

// UPDATE
app.patch("/:productId", productCtrl.updateProduct);

// DELETE
app.delete("/:productId", productCtrl.deleteProduct);

module.exports = app;

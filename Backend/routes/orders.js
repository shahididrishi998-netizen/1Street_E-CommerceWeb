const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const ORDERS_FILE = path.join(__dirname, "../data/orders.json");

function readOrders() {
  try { return JSON.parse(fs.readFileSync(ORDERS_FILE, "utf8")); }
  catch { return []; }
}
function writeOrders(orders) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

/* ---- PLACE ORDER ---- */
router.post("/", (req, res) => {
  const { items, total } = req.body;
  if (!items || !items.length) return res.status(400).json({ message: "No items in order" });

  const orders = readOrders();
  const order = {
    id: "ORD" + Date.now(),
    items,
    total,
    status: "Confirmed",
    placedAt: new Date().toISOString()
  };
  orders.push(order);
  writeOrders(orders);

  res.status(201).json({ message: "Order placed successfully! 🎉", orderId: order.id });
});

/* ---- GET ALL ORDERS ---- */
router.get("/", (req, res) => {
  res.json({ orders: readOrders() });
});

module.exports = router;

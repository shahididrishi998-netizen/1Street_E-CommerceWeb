const express = require("express");
const router = express.Router();

// In-memory cart per session token (for demo)
const carts = {};

function getToken(req) {
  const auth = req.headers.authorization || "";
  return auth.replace("Bearer ", "") || "guest";
}

router.get("/", (req, res) => {
  const token = getToken(req);
  res.json({ cart: carts[token] || [] });
});

router.post("/add", (req, res) => {
  const token = getToken(req);
  const { product, qty = 1 } = req.body;
  if (!product) return res.status(400).json({ message: "Product required" });
  if (!carts[token]) carts[token] = [];
  const ex = carts[token].find(x => x.id === product.id);
  if (ex) ex.qty += qty;
  else carts[token].push({ ...product, qty });
  res.json({ message: "Added to cart", cart: carts[token] });
});

router.delete("/remove/:id", (req, res) => {
  const token = getToken(req);
  if (!carts[token]) return res.json({ cart: [] });
  carts[token] = carts[token].filter(x => x.id !== +req.params.id);
  res.json({ message: "Removed", cart: carts[token] });
});

router.delete("/clear", (req, res) => {
  const token = getToken(req);
  carts[token] = [];
  res.json({ message: "Cart cleared" });
});

module.exports = router;

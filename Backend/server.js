const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

/* -------- MIDDLEWARE -------- */
app.use(cors());
app.use(express.json());

/* -------- STATIC FILES -------- */
app.use(express.static(path.join(__dirname, "../Frontend")));

/* -------- ROUTES -------- */
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/orders");

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

/* -------- HEALTH CHECK -------- */
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "1street backend running 🚀" });
});

/* -------- START -------- */
app.listen(PORT, () => {
  console.log(`🚀 1street server running at http://localhost:${PORT}`);
});

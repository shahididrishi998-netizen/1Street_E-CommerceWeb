const express = require("express");
const router = express.Router();

/* ---- PRODUCTS DATA ---- */
const brands = ["Nike", "Adidas", "Puma", "1street"];
const catNames = ["Jackets", "Hoodies", "Shirts", "T-Shirts"];

const products = [];
for (let i = 1; i <= 120; i++) {
  products.push({
    id: i,
    name: catNames[(i - 1) % 4] + " Style " + (i < 10 ? "0" + i : i),
    brand: brands[i % 4],
    category: catNames[(i - 1) % 4],
    price: 800 + Math.floor(Math.random() * 1700),
    oldPrice: 2500 + Math.floor(Math.random() * 1000),
    discount: [15, 20, 25, 30, 35, 40][i % 6] + "% OFF",
    deal: Math.random() > 0.65,
    image: `https://picsum.photos/seed/p${i}/300/300`
  });
}

/* ---- GET ALL PRODUCTS ---- */
router.get("/", (req, res) => {
  let list = [...products];
  const { brand, category, deal, minPrice, maxPrice, search } = req.query;

  if (brand) list = list.filter(p => p.brand === brand);
  if (category) list = list.filter(p => p.category === category);
  if (deal === "true") list = list.filter(p => p.deal);
  if (minPrice) list = list.filter(p => p.price >= +minPrice);
  if (maxPrice) list = list.filter(p => p.price <= +maxPrice);
  if (search) list = list.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  res.json({ total: list.length, products: list });
});

/* ---- GET SINGLE PRODUCT ---- */
router.get("/:id", (req, res) => {
  const p = products.find(x => x.id === +req.params.id);
  if (!p) return res.status(404).json({ message: "Product not found" });
  res.json(p);
});

module.exports = router;

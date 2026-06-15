/* ============================================================
   PRODUCTS DATA (shared across pages)
============================================================ */
const brands = ["Nike", "Adidas", "Puma", "1street"];
const catNames = ["Jackets", "Hoodies", "Shirts", "T-Shirts"];

const allProducts = [];
for (let i = 1; i <= 120; i++) {
  allProducts.push({
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

/* ============================================================
   CART BADGE
============================================================ */
function updateBadge() {
  const cart = JSON.parse(localStorage.getItem("1street_cart") || "[]");
  const n = cart.reduce((a, b) => a + b.qty, 0);
  const badge = document.getElementById("cartBadge");
  if (badge) badge.textContent = n;
}
updateBadge();

/* ============================================================
   RENDER GRID
============================================================ */
function renderGrid(list) {
  const grid = document.getElementById("productGrid");
  const count = document.getElementById("productCount");
  if (count) count.textContent = `${list.length} products`;
  if (!list.length) {
    grid.innerHTML = `<p class="empty-msg">😕 No products found. Try different filters.</p>`;
    return;
  }
  grid.innerHTML = list.map(p => `
    <div class="card" onclick="openProduct(${p.id})">
      <span class="card-badge">${p.discount}</span>
      <img src="${p.image}" loading="lazy" alt="${p.name}">
      <div class="card-body">
        <p class="card-brand">${p.brand}</p>
        <p class="card-name">${p.name}</p>
        <div class="card-pricing">
          <span class="price-new">₹${p.price.toLocaleString()}</span>
          <span class="price-old">₹${p.oldPrice.toLocaleString()}</span>
        </div>
        <button class="buy-btn" onclick="event.stopPropagation();quickAdd(${p.id})">Add to Cart</button>
      </div>
    </div>`).join("");
}

/* ============================================================
   FILTER LOGIC
============================================================ */
function getFiltered() {
  const brand = document.getElementById("brandFilter").value;
  const cat = document.getElementById("categoryFilter").value;
  const min = +document.getElementById("priceMin").value || 0;
  const max = +document.getElementById("priceMax").value || Infinity;
  const deal = document.getElementById("dealFilter").checked;
  const q = document.getElementById("navSearch").value.trim().toLowerCase();

  return allProducts.filter(p =>
    (!brand || p.brand === brand) &&
    (!cat || p.category === cat) &&
    p.price >= min && p.price <= max &&
    (!deal || p.deal) &&
    (!q || p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
  );
}

document.getElementById("applyFilter").onclick = () => renderGrid(getFiltered());
document.getElementById("resetFilter").onclick = () => {
  ["brandFilter", "categoryFilter", "priceMin", "priceMax"].forEach(id => {
    const el = document.getElementById(id);
    el.value = "";
  });
  document.getElementById("dealFilter").checked = false;
  document.getElementById("navSearch").value = "";
  localStorage.removeItem("filterCategory");
  localStorage.removeItem("lastSearch");
  renderGrid(allProducts);
};

document.getElementById("navSearch").addEventListener("keyup", () => renderGrid(getFiltered()));

/* ============================================================
   INITIAL LOAD (respects category / search from home)
============================================================ */
(function init() {
  const cat = localStorage.getItem("filterCategory");
  const search = localStorage.getItem("lastSearch");

  if (cat) {
    document.getElementById("categoryFilter").value = cat;
    document.getElementById("pageTitle").textContent = cat;
    localStorage.removeItem("filterCategory");
  }
  if (search) {
    document.getElementById("navSearch").value = search;
    localStorage.removeItem("lastSearch");
  }
  renderGrid(getFiltered());
})();

/* ============================================================
   OPEN PRODUCT
============================================================ */
function openProduct(id) {
  localStorage.setItem("selectedProduct", JSON.stringify(allProducts.find(p => p.id === id)));
  window.location.href = "product.html";
}

/* ============================================================
   QUICK ADD TO CART
============================================================ */
function quickAdd(id) {
  const p = allProducts.find(x => x.id === id);
  let cart = JSON.parse(localStorage.getItem("1street_cart") || "[]");
  const ex = cart.find(x => x.id === id);
  if (ex) ex.qty++;
  else cart.push({ ...p, qty: 1 });
  localStorage.setItem("1street_cart", JSON.stringify(cart));
  updateBadge();
  showToast("Added to cart! 🛒");
}

function showToast(msg, color = "#1db954") {
  const t = document.createElement("div");
  t.style.cssText = `position:fixed;bottom:28px;right:28px;background:${color};color:white;padding:13px 22px;border-radius:12px;font-size:14px;font-weight:500;z-index:9999;box-shadow:0 8px 24px rgba(0,0,0,.2);font-family:Poppins,sans-serif;`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2800);
}

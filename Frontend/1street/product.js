/* ============================================================
   LOAD PRODUCT FROM localStorage
============================================================ */
const p = JSON.parse(localStorage.getItem("selectedProduct"));

if (p) {
  document.getElementById("pdImg").src = p.image;
  document.getElementById("pdName").textContent = p.name;
  document.getElementById("pdBrand").textContent = p.brand + " Collection";
  document.getElementById("pdNew").textContent = "₹" + p.price.toLocaleString();
  document.getElementById("pdOld").textContent = "₹" + p.oldPrice.toLocaleString();
  document.getElementById("pdDis").textContent = p.discount;
  document.title = "1street — " + p.name;
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
   SIZE SELECTION
============================================================ */
let selectedSize = "M";
function selectSize(btn, size) {
  document.querySelectorAll(".sz").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  selectedSize = size;
  document.getElementById("selectedSize").textContent = `(${size} selected)`;
}

/* ============================================================
   QUANTITY
============================================================ */
let qty = 1;
function changeQty(d) {
  qty = Math.max(1, qty + d);
  document.getElementById("pdQty").textContent = qty;
}

/* ============================================================
   CART ACTIONS
============================================================ */
function addToCart() {
  if (!p) return;
  let cart = JSON.parse(localStorage.getItem("1street_cart") || "[]");
  const ex = cart.find(x => x.id === p.id);
  if (ex) ex.qty += qty;
  else cart.push({ ...p, qty, selectedSize });
  localStorage.setItem("1street_cart", JSON.stringify(cart));
  updateBadge();
  showToast("Added to cart! 🛒", "#1db954");
}

function buyNow() {
  addToCart();
  window.location.href = "cart.html";
}

/* ============================================================
   TOAST
============================================================ */
function showToast(msg, color = "#1db954") {
  const t = document.createElement("div");
  t.style.cssText = `position:fixed;bottom:28px;right:28px;background:${color};color:white;padding:13px 22px;border-radius:12px;font-size:14px;font-weight:500;z-index:9999;box-shadow:0 8px 24px rgba(0,0,0,.2);font-family:Poppins,sans-serif;`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2800);
}

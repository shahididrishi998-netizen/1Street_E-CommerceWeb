/* ============================================================
   PROMO CODES
============================================================ */
const PROMOS = { "STREET20": 20, "FIRST10": 10, "SAVE30": 30 };
let appliedDiscount = 0;

/* ============================================================
   RENDER CART
============================================================ */
function renderCart() {
  let cart = JSON.parse(localStorage.getItem("1street_cart") || "[]");
  const itemsEl = document.getElementById("cartItems");
  const summaryEl = document.getElementById("cartSummary");
  const countEl = document.getElementById("cartCount");

  if (!cart.length) {
    document.querySelector(".cart-layout").style.display = "block";
    itemsEl.innerHTML = `
      <div class="empty-cart">
        <span class="icon">🛒</span>
        <h3>Your cart is empty</h3>
        <p>Looks like you haven't added anything yet.</p>
        <button onclick="location.href='category.html'">Start Shopping</button>
      </div>`;
    summaryEl.innerHTML = "";
    if (countEl) countEl.textContent = "";
    return;
  }

  document.querySelector(".cart-layout").style.display = "grid";

  const subtotal = cart.reduce((a, b) => a + b.price * b.qty, 0);
  const totalItems = cart.reduce((a, b) => a + b.qty, 0);
  if (countEl) countEl.textContent = `${totalItems} item${totalItems > 1 ? "s" : ""} in cart`;

  itemsEl.innerHTML = cart.map(p => `
    <div class="cart-item">
      <img src="${p.image}" alt="${p.name}" onclick="openProduct(${p.id})" style="cursor:pointer">
      <div class="item-details">
        <p class="item-name">${p.name}</p>
        <p class="item-brand">${p.brand}</p>
        ${p.selectedSize ? `<p class="item-size">Size: ${p.selectedSize}</p>` : ""}
        <p class="item-price">₹${(p.price * p.qty).toLocaleString()}</p>
        <div class="item-row">
          <div class="qty-wrap">
            <button onclick="changeQty(${p.id}, -1)">−</button>
            <span>${p.qty}</span>
            <button onclick="changeQty(${p.id}, 1)">+</button>
          </div>
          <button class="remove-btn" onclick="removeItem(${p.id})" title="Remove">✕</button>
        </div>
      </div>
    </div>`).join("");

  const shipping = subtotal > 999 ? 0 : 99;
  const discountAmt = Math.round(subtotal * appliedDiscount / 100);
  const total = subtotal - discountAmt + shipping;

  summaryEl.innerHTML = `
    <p class="summary-title">Order Summary</p>
    <div class="summary-row"><span>Subtotal (${totalItems} items)</span><span>₹${subtotal.toLocaleString()}</span></div>
    ${appliedDiscount ? `<div class="summary-row free"><span>Promo (${appliedDiscount}% OFF)</span><span>−₹${discountAmt.toLocaleString()}</span></div>` : ""}
    <div class="summary-row ${shipping === 0 ? "free" : ""}"><span>Shipping</span><span>${shipping === 0 ? "FREE 🎉" : "₹" + shipping}</span></div>
    ${subtotal < 999 && !appliedDiscount ? `<p class="free-ship-note">Add ₹${(999 - subtotal).toLocaleString()} more for free shipping!</p>` : ""}
    <div class="summary-total"><span>Total</span><span>₹${total.toLocaleString()}</span></div>
    <div class="promo-input">
      <input type="text" id="promoInput" placeholder="Promo code..." value="${appliedDiscount ? Object.keys(PROMOS).find(k => PROMOS[k] === appliedDiscount) || "" : ""}">
      <button onclick="applyPromo()">Apply</button>
    </div>
    <p style="font-size:11px;color:#aaa;text-align:center;margin-top:-8px">Try: STREET20 · FIRST10 · SAVE30</p>
    <button class="checkout-btn" onclick="checkout(${total})">Proceed to Checkout →</button>`;
}

/* ============================================================
   CART ACTIONS
============================================================ */
function changeQty(id, d) {
  let cart = JSON.parse(localStorage.getItem("1street_cart") || "[]");
  const item = cart.find(x => x.id === id);
  if (!item) return;
  item.qty += d;
  if (item.qty < 1) cart = cart.filter(x => x.id !== id);
  localStorage.setItem("1street_cart", JSON.stringify(cart));
  renderCart();
}

function removeItem(id) {
  let cart = JSON.parse(localStorage.getItem("1street_cart") || "[]");
  cart = cart.filter(x => x.id !== id);
  localStorage.setItem("1street_cart", JSON.stringify(cart));
  showToast("Item removed");
  renderCart();
}

function openProduct(id) {
  const cart = JSON.parse(localStorage.getItem("1street_cart") || "[]");
  const p = cart.find(x => x.id === id);
  if (p) { localStorage.setItem("selectedProduct", JSON.stringify(p)); window.location.href = "product.html"; }
}

/* ============================================================
   PROMO CODE
============================================================ */
function applyPromo() {
  const code = document.getElementById("promoInput")?.value.trim().toUpperCase();
  if (PROMOS[code]) {
    appliedDiscount = PROMOS[code];
    showToast(`Promo applied! ${appliedDiscount}% OFF 🎉`, "#1db954");
    renderCart();
  } else {
    showToast("Invalid promo code", "#e60023");
  }
}

/* ============================================================
   CHECKOUT
============================================================ */
function checkout(total) {
  const cart = JSON.parse(localStorage.getItem("1street_cart") || "[]");
  const token = localStorage.getItem("token");

  fetch("https://onestreet-e-commerceweb.onrender.com/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": "Bearer " + token } : {})
    },
    body: JSON.stringify({ items: cart, total })
  })
    .then(res => res.json())
    .then(data => {
      showToast("🎉 Order placed! We'll contact you soon.", "#1db954");
      localStorage.removeItem("1street_cart");
      setTimeout(() => renderCart(), 1000);
    })
    .catch(() => {
      // Offline/demo fallback
      showToast("🎉 Order placed! (Demo Mode)", "#1db954");
      localStorage.removeItem("1street_cart");
      appliedDiscount = 0;
      setTimeout(() => renderCart(), 1200);
    });
}

/* ============================================================
   TOAST
============================================================ */
function showToast(msg, color = "#333") {
  const t = document.createElement("div");
  t.style.cssText = `position:fixed;bottom:28px;right:28px;background:${color};color:white;padding:13px 22px;border-radius:12px;font-size:14px;font-weight:500;z-index:9999;box-shadow:0 8px 24px rgba(0,0,0,.2);font-family:Poppins,sans-serif;`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

/* ============================================================
   INIT
============================================================ */
renderCart();

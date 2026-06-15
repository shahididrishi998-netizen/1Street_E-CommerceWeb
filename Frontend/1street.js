/* ============================================================
   SEARCH HISTORY
============================================================ */
const input = document.getElementById("searchInput");
const historyBox = document.getElementById("searchHistory");
let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

function renderHistory() {
  if (!searchHistory.length) { historyBox.style.display = "none"; return; }
  historyBox.style.display = "block";
  historyBox.innerHTML = searchHistory.map(h =>
    `<div class="history-item" onclick="goSearch('${h}')">🕐 ${h}</div>`
  ).join("");
}

function goSearch(val) {
  localStorage.setItem("lastSearch", val);
  window.location.href = "1street/category.html";
}

input.addEventListener("focus", renderHistory);
document.addEventListener("click", e => { if (!e.target.closest(".search-wrapper")) historyBox.style.display = "none"; });

input.addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    const value = input.value.trim();
    if (!value) return;
    searchHistory.unshift(value);
    searchHistory = [...new Set(searchHistory)].slice(0, 6);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    goSearch(value);
  }
});

/* ============================================================
   PRODUCTS DATA
============================================================ */
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

/* ============================================================
   TOP DEALS
============================================================ */
const productGrid = document.getElementById("productGrid");
const deals = products.filter(p => p.deal).slice(0, 14);

deals.forEach(p => {
  productGrid.innerHTML += `
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
  </div>`;
});

/* ============================================================
   CATEGORIES
============================================================ */
const categoryGrid = document.getElementById("categoryGrid");
catNames.forEach((c, i) => {
  categoryGrid.innerHTML += `
  <div class="cat-card" onclick="goCategory('${c}')">
    <img src="https://picsum.photos/seed/cat${i + 10}/300/280" loading="lazy" alt="${c}">
    <div class="cat-overlay"><span class="cat-name">${c}</span></div>
  </div>`;
});

function goCategory(cat) {
  localStorage.setItem("filterCategory", cat);
  window.location.href = "1street/category.html";
}

/* ============================================================
   OPEN PRODUCT
============================================================ */
function openProduct(id) {
  localStorage.setItem("selectedProduct", JSON.stringify(products.find(p => p.id === id)));
  window.location.href = "1street/product.html";
}

/* ============================================================
   QUICK ADD TO CART
============================================================ */
function quickAdd(id) {
  const p = products.find(x => x.id === id);
  let cart = JSON.parse(localStorage.getItem("1street_cart") || "[]");
  const ex = cart.find(x => x.id === id);
  if (ex) ex.qty++;
  else cart.push({ ...p, qty: 1 });
  localStorage.setItem("1street_cart", JSON.stringify(cart));
  showToast("Added to cart! 🛒");
}

function showToast(msg) {
  const t = document.createElement("div");
  t.style.cssText = "position:fixed;bottom:28px;right:28px;background:#1db954;color:white;padding:13px 22px;border-radius:12px;font-size:14px;font-weight:500;z-index:9999;box-shadow:0 8px 24px rgba(0,0,0,.2);font-family:Poppins,sans-serif;transition:.4s;";
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2800);
}

/* ============================================================
   SCROLL REVEAL
============================================================ */
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("active"); });
}, { threshold: 0.12, rootMargin: "-40px" });
document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

/* ============================================================
   3D HERO CANVAS — Particle Network
============================================================ */
(function() {
  const canvas = document.getElementById("heroCanvas");
  const ctx = canvas.getContext("2d");
  let W, H, particles = [];
  let mx = 0, my = 0;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  window.addEventListener("resize", () => { resize(); init(); });
  resize();

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.z = Math.random() * 2 + 0.5;
      this.r = Math.random() * 2.5 + 0.5;
      this.vx = (Math.random() - 0.5) * 0.6 * this.z;
      this.vy = (Math.random() - 0.5) * 0.4 * this.z;
      this.color = Math.random() > 0.7 ? "#ffcc00" : Math.random() > 0.5 ? "#ffffff" : "#666";
      this.alpha = Math.random() * 0.55 + 0.2;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
      // Mouse attraction
      const dx = mx - this.x, dy = my - this.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 180) { this.x += dx * 0.007; this.y += dy * 0.007; }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r * this.z, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  function init() {
    particles = [];
    const count = Math.min(Math.floor((W * H) / 7500), 140);
    for (let i = 0; i < count; i++) particles.push(new Particle());
  }
  init();

  canvas.closest(".hero-section")?.addEventListener("mousemove", e => {
    const r = canvas.getBoundingClientRect();
    mx = e.clientX - r.left; my = e.clientY - r.top;
  });

  function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "rgba(10,10,10,0.92)";
    ctx.fillRect(0, 0, W, H);

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 115) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(255,204,0,${0.12 * (1 - dist / 115)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
      particles[i].update();
      particles[i].draw();
    }
  }
  animate();
})();

/* ============================================================
   3D BANNER CANVAS — Floating Cubes
============================================================ */
(function() {
  const canvas = document.getElementById("bannerCanvas");
  const ctx = canvas.getContext("2d");
  let W, H;
  const boxes = [];

  function resize() { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; }
  window.addEventListener("resize", resize); resize();

  class Box {
    constructor() {
      this.x = Math.random() * W; this.y = Math.random() * H;
      this.size = Math.random() * 38 + 14;
      this.rot = Math.random() * Math.PI * 2;
      this.speed = Math.random() * 0.009 + 0.003;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.35;
      this.alpha = Math.random() * 0.2 + 0.05;
      this.color = Math.random() > 0.6 ? "#ffcc00" : Math.random() > 0.5 ? "#ffffff" : "#555";
    }
    update() {
      this.rot += this.speed;
      this.x += this.vx; this.y += this.vy;
      if (this.x < -60) this.x = W + 60; if (this.x > W + 60) this.x = -60;
      if (this.y < -60) this.y = H + 60; if (this.y > H + 60) this.y = -60;
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot);
      ctx.globalAlpha = this.alpha;
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 1.5;
      const s = this.size, off = s * 0.38;
      ctx.strokeRect(-s / 2, -s / 2, s, s);
      ctx.beginPath();
      ctx.moveTo(-s / 2, -s / 2); ctx.lineTo(-s / 2 + off, -s / 2 - off);
      ctx.moveTo(s / 2, -s / 2); ctx.lineTo(s / 2 + off, -s / 2 - off);
      ctx.moveTo(s / 2, s / 2); ctx.lineTo(s / 2 + off, s / 2 - off);
      ctx.moveTo(-s / 2 + off, -s / 2 - off); ctx.lineTo(s / 2 + off, -s / 2 - off);
      ctx.moveTo(s / 2 + off, -s / 2 - off); ctx.lineTo(s / 2 + off, s / 2 - off);
      ctx.stroke();
      ctx.restore();
      ctx.globalAlpha = 1;
    }
  }

  for (let i = 0; i < 32; i++) boxes.push(new Box());

  function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, W, H);
    boxes.forEach(b => { b.update(); b.draw(); });
  }
  animate();
})();

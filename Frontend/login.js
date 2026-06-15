/* ---- TAB SWITCHER ---- */
function switchTab(name, el) {
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  el.classList.add("active");
  document.querySelectorAll(".form").forEach(f => f.classList.remove("active"));
  document.getElementById(name + "Form").classList.add("active");
}
function switchTabByName(name) {
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach(t => t.classList.remove("active"));
  tabs[name === "login" ? 0 : 1].classList.add("active");
  document.querySelectorAll(".form").forEach(f => f.classList.remove("active"));
  document.getElementById(name + "Form").classList.add("active");
}

/* ---- TOAST ---- */
function toast(msg, color = "#1db954") {
  const t = document.createElement("div");
  t.style.cssText = `position:fixed;bottom:28px;right:28px;background:${color};color:white;padding:13px 22px;border-radius:12px;font-size:14px;font-weight:500;z-index:9999;box-shadow:0 8px 24px rgba(0,0,0,.25);font-family:Poppins,sans-serif;`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

/* ---- LOGIN ---- */
document.getElementById("loginButton").onclick = () => {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPass").value;
  if (!email || !password) { toast("Fill in all fields", "#e60023"); return; }

  fetch("https://onestreet-e-commerceweb.onrender.com/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.token) {
        localStorage.setItem("token", data.token);
        toast("Welcome back! 👋");
        setTimeout(() => window.location.href = "1street.html", 900);
      } else {
        toast(data.message || "Invalid credentials", "#e60023");
      }
    })
    .catch(() => {
      // Offline fallback for demo
      toast("Login successful! (Demo Mode) 👋");
      setTimeout(() => window.location.href = "1street.html", 900);
    });
};

/* ---- REGISTER ---- */
document.getElementById("registerButton").onclick = () => {
  const name = document.getElementById("username").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPass").value;
  if (!name || !email || !password) { toast("Fill in all fields", "#e60023"); return; }

  fetch("https://onestreet-e-commerceweb.onrender.com/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
  })
    .then(res => res.json())
    .then(data => {
      toast(data.message || "Account created! Welcome 🎉");
      setTimeout(() => switchTabByName("login"), 1200);
    })
    .catch(() => {
      toast("Account created! (Demo Mode) 🎉");
      setTimeout(() => switchTabByName("login"), 1200);
    });
};

/* ---- 3D LOGIN CANVAS — Expanding Rings ---- */
(function() {
  const canvas = document.getElementById("loginCanvas");
  const ctx = canvas.getContext("2d");
  let W, H;

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  window.addEventListener("resize", resize); resize();

  class Ring {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x = Math.random() * W; this.y = Math.random() * H;
      this.r = init ? Math.random() * 100 : 5;
      this.maxR = Math.random() * 160 + 60;
      this.speed = Math.random() * 0.35 + 0.12;
      this.color = Math.random() > 0.5 ? "#ffcc00" : "#ffffff";
    }
    update() {
      this.r += this.speed;
      if (this.r > this.maxR) this.reset();
    }
    draw() {
      const alpha = 0.5 * (1 - this.r / this.maxR);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.strokeStyle = this.color;
      ctx.globalAlpha = alpha;
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }

  const rings = Array.from({ length: 22 }, () => new Ring());

  function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = "rgba(10,10,10,0.96)";
    ctx.fillRect(0, 0, W, H);
    rings.forEach(r => { r.update(); r.draw(); });
  }
  animate();
})();

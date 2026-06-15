# 1street — Men's Streetwear 🔥

A full-stack e-commerce website for men's streetwear.

---

## 📁 Project Structure

```
Project 1street/
├── Frontend/
│   ├── 1street.html       ← Home Page
│   ├── 1street.css
│   ├── 1street.js
│   ├── login.html         ← Login / Register Page
│   ├── login.css
│   ├── login.js
│   └── 1street/
│       ├── category.html  ← Shop / All Products
│       ├── category.css
│       ├── category.js
│       ├── product.html   ← Product Detail Page
│       ├── product.css
│       ├── product.js
│       ├── cart.html      ← Cart Page
│       ├── cart.css
│       └── cart.js
└── Backend/
    ├── server.js
    ├── package.json
    ├── data/
    │   ├── users.json
    │   └── orders.json
    └── routes/
        ├── auth.js
        ├── products.js
        ├── cart.js
        └── orders.json
```

---

## 🚀 Setup & Run

### Backend
```bash
cd Backend
npm install
npm start
# Server runs at http://localhost:3000
```

### Frontend
Just open `Frontend/1street.html` in your browser.
Or with the backend running, visit `http://localhost:3000`.

---

## ✨ Features
- 🏠 Home page with **3D particle animation** + floating cubes
- 🔍 Search with history
- 🗂️ Category/filter page (brand, type, price, deals)
- 🛍️ Product detail with size selector + quantity
- 🛒 Cart with promo codes (try: STREET20, FIRST10, SAVE30)
- 👤 Login / Register
- 📦 Order placement (saved to `data/orders.json`)
- 📱 Fully responsive (mobile-friendly)

---

## 🎨 3D Animations
- **Hero Section**: Interactive particle network (follow your mouse!)
- **Banner Section**: Floating 3D isometric cubes
- **Login Page**: Expanding ring animation

---

## 🔑 Promo Codes
| Code | Discount |
|------|----------|
| STREET20 | 20% OFF |
| FIRST10 | 10% OFF |
| SAVE30 | 30% OFF |

---

Made with ❤️ in Mumbai

const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const USERS_FILE = path.join(__dirname, "../data/users.json");

function readUsers() {
  try { return JSON.parse(fs.readFileSync(USERS_FILE, "utf8")); }
  catch { return []; }
}
function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}
function hashPass(pass) {
  return crypto.createHash("sha256").update(pass).digest("hex");
}
function makeToken(user) {
  // Simple token — replace with jsonwebtoken in production
  const payload = Buffer.from(JSON.stringify({ id: user.id, email: user.email })).toString("base64");
  return payload + "." + crypto.randomBytes(8).toString("hex");
}

/* ---- REGISTER ---- */
router.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields required" });

  const users = readUsers();
  if (users.find(u => u.email === email))
    return res.status(409).json({ message: "Email already registered" });

  const user = { id: Date.now(), name, email, password: hashPass(password), createdAt: new Date().toISOString() };
  users.push(user);
  writeUsers(users);
  res.status(201).json({ message: "Account created successfully! Welcome to 1street 🎉" });
});

/* ---- LOGIN ---- */
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  const users = readUsers();
  const user = users.find(u => u.email === email && u.password === hashPass(password));
  if (!user)
    return res.status(401).json({ message: "Invalid email or password" });

  res.json({ token: makeToken(user), name: user.name, email: user.email });
});

module.exports = router;

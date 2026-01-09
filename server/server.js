const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

// Fake user for demo
const demoUser = { email: "user@example.com", password: "1234", name: "Demo User" };

app.get("/", (req, res) => res.render("index", { user: demoUser }));

app.get("/login", (req, res) => res.render("login"));
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (email === demoUser.email && password === demoUser.password) {
    res.render("dashboard", { user: demoUser });
  } else {
    res.render("login", { error: "Invalid credentials!" });
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));

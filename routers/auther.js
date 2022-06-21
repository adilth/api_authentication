const express = require("express");
const router = express.Router();

const Auth = require("../models/Auth");

router.get("/register", (req, res) => {
  res.send("hi");
});
router.post("/register", async (req, res) => {
  const user = await new Auth({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  try {
    res.json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

module.exports = router;

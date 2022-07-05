const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("./isauth");
const verify = require("./verifyToken");

router.get("/", ensureAuthenticated, verify, (req, res) => {
  res.render("index.ejs", { name: req.user.name });
});
router.get("/welcome", forwardAuthenticated, (req, res) => {
  res.render("welcome.ejs");
});
module.exports = router;

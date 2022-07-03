const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("./isauth");
const verify = require("./verifyToken");

router.get("/", verify, ensureAuthenticated, (req, res) => {
  res.render("index.ejs");
  console.log(req);
});
router.get("/welcome", forwardAuthenticated, (req, res) => {
  res.render("welcome.ejs");
});
module.exports = router;

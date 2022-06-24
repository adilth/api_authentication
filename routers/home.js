const express = require("express");
const router = express.Router();

const verify = require("./verifyToken");

router.get("/", verify, (req, res) => {
  res.render("index.ejs");
});
router.get("/welcome", (req, res) => {
  res.render("welcome.ejs");
});
module.exports = router;

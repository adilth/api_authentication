const express = require("express");
const router = express.Router();

const verify = require("./verifyToken");

router.get("/", verify, (req, res) => {
  res.json({
    posts: {
      title: "this is a post",
      disc: "a random post is created here and will before being published",
    },
    info: req.user,
  });
});

module.exports = router;

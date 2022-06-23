const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { registerValidation, loginValidation } = require("../validation");

const Auth = require("../models/Auth");

router.get("/register", (req, res) => {
  res.render("register.ejs");
});
router.get("/login", (req, res) => {
  res.render("login.ejs");
});

router.post("/register", async (req, res) => {
  //validate the data before user
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).json(error.details[0].message);

  //check if the user is already registered
  const emailExists = await Auth.findOne({ email: req.body.email });
  if (emailExists)
    return res.status(400).json({ error: "Email already exists" });

  //hah passwords
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  //create new user
  const user = await new Auth({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword,
  });
  try {
    const saveUser = await user.save();
    res.json({ saveUser: saveUser._id });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  //validate the data before user
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).json(error.details[0].message);

  //check if the user is already registered
  const user = await Auth.findOne({ email: req.body.email });
  if (!user) return res.status(404).json({ error: "Email not found" });

  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass)
    return res.status(400).json({ error: "Password is incorrect" });

  //create and assign a token
  const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRT);
  res.header("auth-token", token).send(token);
  res.json(`hello ${user.name} you login successfully`);
});

function ckeckAuthentication(req, res, next) {
  if (req.session.name) {
    return next();
  }
  res.redirect("/login");
}
function nckeckAuthentication(req, res, next) {
  if (req.session.name) {
    return res.redirect("/");
  }
  next();
}

module.exports = router;

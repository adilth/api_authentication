const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { registerValidation, loginValidation } = require("../validation");
const { forwardAuthenticated } = require("./isauth");

const Auth = require("../models/Auth");

router.get("/register", forwardAuthenticated, (req, res) => {
  res.render("register.ejs");
});
router.get("/login", forwardAuthenticated, (req, res) => {
  res.render("login.ejs");
});

router.post("/register", async (req, res) => {
  //validate the data before user
  // const { } = req.body;
  // let errorMsg = [];

  const { error } = registerValidation(req.body);
  if (error) {
    const { details } = error;
    const message = details.map((i) => i.message).join(",");
    console.log("error", message);
    // errorMsg.push({ msg: message });
    res.status(422).json({ message });
    res.render("register", { error: message });
  }
  const emailExists = await Auth.findOne({ email: req.body.email });
  if (emailExists) {
    const message = "User already registered.";
    // errorMsg.push({ msg: message });
    res.render("register", { error: message });
    return;
  }
  //check if the user is already registered

  // if (error) {
  //   res.render("register", { error });
  // }

  try {
    //hah passwords
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const user = new Auth({
      name: req.body.name,
      email: req.body.email,
      password: hashPassword,
    });

    const saveUser = await user.save();
    req.flash(
      "success",
      "You have successfully created a new user and now you can login"
    );
    // res.json({ saveUser: saveUser._id });
    res.redirect("login");
  } catch (err) {
    res.status(404).json({ message: err.message });
    // res.redirect("/register");
  }
});

router.post("/login", async (req, res, next) => {
  //validate the data before user
  const { error } = loginValidation(req.body);
  if (error) {
    // return req.flash("errorLogin", `${error.details[0].message}`);
    // var err = new Error(error.details[0].message);
    // err.status = 400;
    // return next(err);
    const { details } = error;
    const message = details.map((i) => i.message).join(",");
    console.log("error", message);
    // errorMsg.push({ msg: message });
    // res.status(422).json({ message });
    res.render("login", { error: message });
    // res.status(404).send({ message: error.message });
    return;
  }

  //check if the user is already registered
  const user = await Auth.findOne({ email: req.body.email });
  // if (!user) return res.status(404).json({ message: "Email not found" });

  // const validPass = await bcrypt.compare(req.body.password, user.password);
  // if (!validPass)
  //   return res.status(400).json({ message: "Password is incorrect" });

  //create and assign a token
  try {
    passport.authenticate(
      "local",
      {
        successRedirect: "/home",
        failureRedirect: "/user/login",
        failureFlash: true,
      },
      (req, res, next) => {
        const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRT);
        res.header("auth-token", token).send(token);
        next();
      }
    );
  } catch (err) {
    res.status(404).json({ messages: err.message });
  }

  // res.json(`hello ${user.name} you login successfully`);
  // res.redirect("/");
});

module.exports = router;

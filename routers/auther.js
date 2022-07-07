const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { registerValidation, loginValidation } = require("../validation");
const { forwardAuthenticated } = require("./isauth");

const Auth = require("../models/Auth");
const { response } = require("express");

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
  //check if the user is already registered
  if (emailExists) {
    const message = "User already registered.";
    // errorMsg.push({ msg: message });
    res.render("register", { error: message });
    return;
  }

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

    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.JWT_SECRT,
      {
        expiresIn: 86400,
      }
    );

    // save user token
    user.token = token;

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

router.post("/login", (req, res, next) => {
  passport.authenticate("local", async (err, users, info) => {
    //validate the data before user
    const { error } = loginValidation(req.body);
    if (err) {
      const { details } = error;
      console.log(err);
      const message = details.map((i) => i.message).join(",");
      console.log("error", message);
      // errorMsg.push({ msg: message });
      // res.status(422).json({ message });
      res.render("login", { error: message });
      // res.status(404).send({ message: error.message });
      return;
    }

    //check if the user is already registered

    // if (!user) return res.status(404).json({ message: "Email not found" });

    // const validPass = await bcrypt.compare(req.body.password, user.password);
    // if (!validPass)
    //   return res.status(400).json({ message: "Password is incorrect" });

    //create and assign a token
    try {
      if (info != undefined) {
        console.log(info.message);
        const { message } = info;
        res.render("login", { error: message });
        console.log(message);
        return;
      } else {
        const user = await Auth.findOne({ email: req.body.email });
        const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRT, {
          expiresIn: "1h",
        });
        req.logIn(user, { session: false }, function (err) {
          // Should not cause any errors

          if (err) {
            return next(err);
          }
          res.cookie("token", token, { httpOnly: true });
          res.header("x-auth-token", token);
          res.redirect("/home");
          // res.send(user);
        });

        // .send(JSON.stringify(info));
        // res.status(200).data = {
        //  auth: true,
        //   user: user,
        //   token,
        // };
        // return res.redirect("/home");
      }
    } catch (err) {
      console.log(err);
      res.status(404).json({ messages: err.message });
    }
  })(req, res, next);
});
router.get("/logout", (req, res, next) => {
  res.clearCookie("user");
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out");
    req.session.destroy();
    res.redirect("/home/welcome");
  });
});
// DELETE /api/auth/logout
// router.delete("/logout", (req, res) => {
//   if (req.session) {
//     req.session.destroy((err) => {
//       if (err) {
//         res.status(400).send("Unable to log out");
//       } else {
//         res.send("Logout successful");
//       }
//     });
//   } else {
//     res.end();
//   }
// });
module.exports = router;

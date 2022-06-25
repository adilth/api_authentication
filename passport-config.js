const LocalStregy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

//load user model
const User = require("./models/Auth");

function initialize(passport, getUserById) {
  const authenticateUser = async (email, password, dane) => {
    //  const user = getUserByEmail(email);
    const user = await User.findOne({ email: email });

    if (user == null) {
      return dane(null, false, { message: "no user with that email" });
    }
    try {
      if (await bcrypt.compare(password, user.password)) {
        return dane(null, user);
      } else {
        return dane(user, false, { message: "Password mismatch" });
      }
    } catch (e) {
      return dane(e);
    }
  };
  passport.use(new LocalStregy({ usernameField: "email" }, authenticateUser));
  passport.serializeUser((user, dane) => dane(null, user.id));
  passport.deserializeUser((id, dane) => {
    User.findById(id, (err, user) => {
      return dane(err, user);
    });
  });
}

module.exports = initialize;

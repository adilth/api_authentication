const { Strategy } = require("passport-local");
const bcrypt = require("bcryptjs");

//load user model
const User = require("./models/Auth");

// function initialize(passport, getUserById) {
//   const authenticateUser = async (email, password, dane) => {
//     //  const user = getUserByEmail(email);
//     const user = await User.findOne({ email: email });

//     if (user == null) {
//       return dane(null, false, { message: "no user with that email" });
//     }
//     try {
//       if (await bcrypt.compare(password, user.password)) {
//         return dane(null, user);
//       } else {
//         return dane(user, false, { message: "Password mismatch" });
//       }
//     } catch (e) {
//       return dane(e);
//     }
//   };
//   passport.use(local, new Strategy({ usernameField: "email" }, authenticateUser));
//   passport.serializeUser((user, dane) => dane(null, user.id));
//   passport.deserializeUser((id, dane) => {
//     User.findById(id, (err, user) => {
//       return dane(err, user);
//     });
//   });
// }

// module.exports = initialize;

module.exports = function (passport) {
  passport.use(
    new Strategy({ usernameField: "email" }, (email, password, done) => {
      // Match user
      User.findOne({
        email: email,
      }).then((user) => {
        if (!user) {
          return done(null, false, { message: "That email is not registered" });
        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Password incorrect" });
          }
        });
      });
    })
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};

const { Strategy } = require("passport-local");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
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
    "local",
    new Strategy(
      { usernameField: "email", passwordField: "password" },
      async (email, password, done) => {
        // Match user
        const user = await User.findOne({ email: email });
        // then((user) => {
        try {
          if (!user) {
            return done(null, false, { message: message.err });
          }

          // Match password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
              return done(err);
            }
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: "Password incorrect" });
            }
          });
        } catch (err) {
          console.log(err);
          return done(null, false, { message: "Something went wrong" });
        }
        // });
      }
    )
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
// module.exports = (passport) => {
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.SESSION_SECRET;
passport.use(
  "jwt",
  new JwtStrategy(opts, (jwt_payload, done) => {
    User.findById(jwt_payload.id)
      .then((user) => {
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      })
      .catch((err) => {
        console.log("Error in finding user by id in jwt.");
        return done(err, false);
      });
  })
);
// };
// module.exports = passportConfig;

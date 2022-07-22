// module.exports = {
//   ensureAuthenticated: (req, res, next) => {
//     if (req.isAuthenticated()) {
//       console.log("you in");
//       return next();
//     }
//     console.log("you need to login first");
//     res.redirect("/user/login");
//     req.flash("error", "Please log in to view home page");
//   },
//   forwardAuthenticated: (req, res, next) => {
//     if (req.isAuthenticated()) {
//       console.log("you allready logged in");
//       return res.redirect("/home");
//     }
//     console.log("you log out");
//     next();
//   },
// };
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    console.log("you in");
    return next();
  }
  console.log("you need to login first");
  res.redirect("/user/login");
  req.flash("error", "Please log in to view home page");
}
// }
function forwardAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    console.log("you allready logged in");
    return res.redirect("/home");
  }
  console.log("you log out");
  next();
}
module.exports = { ensureAuthenticated, forwardAuthenticated };

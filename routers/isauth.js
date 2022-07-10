// function ensureAuthenticated

// }
// function forwardAuthenticated

module.exports = {
  ensureAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/user/login");
    req.flash("error", "Please log in to view home page");
  },
  forwardAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return res.redirect("/home");
    }
    next();
  },
};

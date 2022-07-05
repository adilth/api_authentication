function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "Please log in to view home page");
  res.redirect("/user/login");
}
function forwardAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/home");
  }
  next();
}

module.exports = { forwardAuthenticated, ensureAuthenticated };

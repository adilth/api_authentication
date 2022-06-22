const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("auth-token");
  if (!token) return res.status(401).json({ message: "Invalid token" });

  try {
    const varified = jwt.verify(token, process.env.JWT_SECRT);
    req.user = varified;
    next();
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
};

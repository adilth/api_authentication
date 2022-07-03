const jwt = require("jsonwebtoken");

const verify = function (req, res, next) {
  const tokenSecret = req.header["auth-token"];
  const token = req.cookies.token || (tokenSecret && tokenSecret.split(" ")[1]);
  if (!token) return res.status(401).json({ message: "Invalid token" });

  try {
    const varified = jwt.verify(token, process.env.JWT_SECRT);
    req.user = varified;
    next();
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
};
module.exports = verify;

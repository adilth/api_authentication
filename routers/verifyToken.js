const jwt = require("jsonwebtoken");

const verify = function (req, res, next) {
  const tokenSecret = req.header["auth-token"];
  const token = req.cookies.token || (tokenSecret && tokenSecret.split(" ")[1]);
  if (!token) return res.status(401).json({ message: "Invalid token" });

  try {
    const varified = jwt.verify(
      token,
      process.env.JWT_SECRT,
      function (err, decoded) {
        if (err)
          return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        req.user = varified;
        req.token = token;
        // res.status(200).send(user); Comment this out!
        next(user); // add this line
      }
    );

    // res.status(200).send(token);
    // next();
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
};
module.exports = verify;

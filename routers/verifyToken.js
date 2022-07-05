const jwt = require("jsonwebtoken");

const verify = async function (req, res, next) {
  const tokenSecret = req.header["x-auth-token"];
  const token =
    req.cookies.token ||
    req.cookies.access_token ||
    tokenSecret ||
    tokenSecret.split(" ")[1] ||
    req.body.token;
  if (!token) return res.status(401).json({ message: "Invalid token" });

  try {
    const varified = await jwt.verify(token, process.env.JWT_SECRT);
    // function (err, decoded) {
    //   if (err)
    //     return res.status(500).send("There was a problem finding the user.");
    //   if (!user) return res.status(404).send("No user found.");
    req.user = varified;
    req.token = token;
    // res.status(200).send(user); Comment this out!
    return next(); // add this line
    // }
    // );

    // res.status(200).send(token);
    // next();
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
};
module.exports = verify;

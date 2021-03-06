const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const flash = require("express-flash");
const bcrypt = require("bcryptjs");
const methodOverride = require("method-override");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const expressLayouts = require("express-ejs-layouts");

require("dotenv").config();
//import routers
const autherRouter = require("./routers/auther");
const homeRouter = require("./routers/home");
// const postsRouter = require("./routers/Posts");
const PORT = process.env.PORT || 4000;
const passport = require("passport");
//connect to DB
require("./passport-config")(passport);
mongoose.connect(process.env.CONNECT_DB, { useNewUrlParser: true }, () =>
  console.log("Connect to DB")
);

//router middleware
// app.use(express.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded
app.use(express.json());
app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
app.use(flash());
app.use(passport.authenticate("session"));
app.use((req, res, next) => {
  res.locals.loggedIn = req.isAuthenticated();
  res.locals.user = req.user || false;
  res.locals.session = req.session;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.errorLogin = req.flash("errorLogin");
  next();
});
// Middleware to accept requests from localhost:3000
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
//current User
// app.use("/getUser")
app.use("/user", autherRouter);
app.use("/home", homeRouter);
// app.use("/posts", postsRouter);

// app.get("/", (req, res) => {
//   res.render("index.ejs");
// });
//listent
app.listen(PORT, () => console.log("it runnig"));

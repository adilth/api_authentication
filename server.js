const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();
//import routers
const autherRouter = require("./routers/auther");
const postsRouter = require("./routers/Posts");
const PORT = process.env.PORT || 3000;

//connect to DB

mongoose.connect(process.env.CONNECT_DB, () => console.log("Connect to DB"));

//router middleware
// app.use(express.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.static("public"));
// Middleware to accept requests from localhost:3000
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use("/user", autherRouter);
app.use("/posts", postsRouter);

// app.get("/register", (req, res) => {
//   res.render("register");
// });
//listent
app.listen(PORT, () => console.log("it runnig"));

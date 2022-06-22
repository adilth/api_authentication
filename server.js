const express = require("express");
const app = express();
const mongoose = require("mongoose");

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
app.use("/api/user", autherRouter);
app.use("/api/posts", postsRouter);

//listent
app.listen(PORT, () => console.log("it runnig"));

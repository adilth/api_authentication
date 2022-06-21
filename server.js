const express = require("express");
const app = express();
const mongoose = require("mongoose");

require("dotenv").config();

const PORT = process.env.PORT || 3000;

//connect to DB

mongoose.connect(process.env.CONNECT_DB, () => console.log("Connect to DB"));

//import routers
const autherRouter = require("./routers/auther");

//router middleware
app.set("view engine", "ejs");
app.use("/api/user", autherRouter);
app.use(express.json());

//listent
app.listen(PORT, () => console.log("it runnig"));

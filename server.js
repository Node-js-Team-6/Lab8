import express from "express";
import logger from "morgan";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser"
import passport from  "passport"


import db from "./app/models/models.js";
import postRouter from "./app/routes/posts.router.js";
import userRouter from "./app/routes/users.router.js";
import setupPassport from "./app/setup.passport.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "pug");

// configure app
app.use(logger("dev"));

app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded());

//for static files
const staticPath = path.resolve(__dirname, "public");
app.use(express.static(staticPath));

// connect to db

db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connect to the database"))
  .catch((err) => {
    console.log("Cannot connect to the database", err);
    process.exit();
  });

setupPassport();

//routing
/*
 * parameters:
 * app.get("/users/:userid", (req, res) => {
 *   let userId = parseInt(req.params.userid, 10);
 * });
 *
 * app.get(/^\/users\/(\d+)$/, function(req, res) {
 *   let userId = parseInt(req.params[0], 10);
 * });
 *
 * app.get(/^\/users\/(\d+)-(\d+)$/, function(req, res) {
 *   let startId = parseInt(req.params[0], 10);
 *   let endId = parseInt(req.params[1], 10);
 * });
 *
 * query arguments:
 * url: https://www.google.com/search?q=javascript-themed%20burrito
 * app.get("/search", function(req, res) {
 *   // req.query.q == "javascript-themed burrito"
 * });
 *
 *
 */

// api

app.get("/", function (req, res) {
  res.render("index", {
    title: "Home",
    message: "Hey everyone! This is my webpage.",
  });
});

//routers
app.use("/users", userRouter);
app.use("/posts", postRouter);

// listen to port
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

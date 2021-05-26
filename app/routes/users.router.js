import express from "express";
import passport from "passport";

import controller from "../controllers/users.controller.js";

const api = express.Router();

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated) {
    next();
  } else {
    res.redirect("/login");
  }
};
api.get("/login/failed", (req, res) => {
  res.status(401).send({
    message: "Failed to log in",
  });
});

api.get("/login", (req, res) => res.render("login"));

api.post(
  "/login",
  passport.authenticate("login", {
    successRedirect: "/",
    failureRedirect: "/login/failed",
  })
);

//logout
api.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

//set user as local variable, so that views can see it
api.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

api.get("/", controller.findAll);

api.get("/:id", controller.findOne);

//edit profile
api.get("/edit/:id", ensureAuthenticated, controller.findOne);

api.post("/edit/:id", ensureAuthenticated, function (req, res) {
  if (controller.update(req, res)) {
  }
  res.redirect("/edit");
});

api.get("/delete/:id", ensureAuthenticated, controller.findOne);
api.post("/delete/:id", ensureAuthenticated, (req, res) => {
  controller.remove(req, res);
  req.redirect("/logout");
});

export default api;

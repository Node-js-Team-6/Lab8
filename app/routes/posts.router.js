import express from "express";
import controller from "../controllers/posts.controller.js";

const api = express.Router();

api.get("/", controller.findAll);

api.get("/create", (req, res) => {res.render("writepost")});
api.post("/create", controller.create);

api.get("/:id", controller.findOne);

api.get("/edit/:id", controller.findOne);
api.post("/edit/:id", controller.update);

api.get("/delete/:id", controller.findOne);
api.post("delete/:id", controller.remove);
export default api;

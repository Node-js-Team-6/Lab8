import express from "express";
import controller from "../controllers/posts.controller.js";

const api = express.Router();

api.get("/", controller.findAll);

api.get("create", (req, res) => {});
api.post("/create", controller.create);

api.get("/:id", controller.findOne(req, res));

api.get("/edit/:id", controller.findOne(req, res));
api.post("/edit/:id", controller.update(req, res));

api.get("/delete/:id", controller.findOne(req, res));
api.post("delete/:id", controller.remove);
export default api;

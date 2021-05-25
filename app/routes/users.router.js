import express from "express";

import controller from "../controllers/users.controller.js";

const api = express.Router();

api.get("/", controller.findAll);

api.get("/:id", controller.findOne);

export default api;

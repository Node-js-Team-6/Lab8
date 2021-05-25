import { url } from "../config/db.config.js";

import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = url;
db.posts = (await import("./post.model.js")).default(
  mongoose,
  mongoosePaginate
);
db.users = (await import("./user.model.js")).default(
  mongoose,
  mongoosePaginate
);
db.comments = (await import("./comment.model.js")).default(
  mongoose,
  mongoosePaginate
);

export default db;

import db from "../models/models.js";
import { getPagination } from "./pagination.js";

const Post = db.posts;

function create(req, res) {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a Post
  const post = new Post({
    title: req.body.title,
    description: req.body.description,
    text: req.body.text,
    photos: req.body.photos,
    author: req.body.authorId,
  });

  //Save in the db
  post
    .save(post)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Post.",
      });
    });
}

//Can also specify title filter and author filter
function findAll(req, res) {
  const { title, author, page, size } = req.query;

  let condition = title
    ? { title: { $regex: new RegExp(title), $options: "i" } }
    : {};

  if (author) {
    condition.author = author;
  }

  const { limit, offset } = getPagination(page, size);

  Post.paginate(condition, { offset, limit })
    .then((data) => {
      res.send({
        totalItems: data.totalDocs,
        items: data.docs,
        totalPages: data.totalPages,
        currentPage: data.page - 1,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving posts.",
      });
    });
}

function findOne(req, res) {
  const id = req.body.id;

  Post.findById(id)
    .populate("author")
    .populate("comments")
    .then((data) => {
      for (let comment of data.comments) {
        comment.populate("author").execPopulate();
      }
    })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: "Not found Post with id " + id,
        });
      } else {
        res.send(data);
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error retrieving Post with id=" + id,
      });
    });
}

function update(req, res) {
  if (!res.body) {
    res.status(400).send({
      message: "Data to update cannot be empty",
    });
    return;
  }

  const id = req.params.id;

  Post.findByIdAndModify(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Post with id=${id}. Maybe Post was not found!`,
        });
      } else {
        res.send({ message: "Post was updated successfully." });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error updating Post with id=" + id,
      });
    });
}

function remove(req, res) {
  const id = req.params.id;

  Post.findByIdAndRemove(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Post with id=${id}. Maybe Post was not found!`,
        });
      } else {
        res.send({ message: "Post was deleted successfully." });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error deleting Post with id=" + id,
      });
    });
}

// Can pass author id
function removeAll(req, res) {
  const authorId = req.body.authorId;
  let condition = authorId ? { author: authorId } : {};

  Post.deleteMany(condition)
    .then((data) => {
      res.send({
        message: `${data.deletedCount} Posts were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all comments.",
      });
    });
}

const services = {
  create,
  findOne,
  findAll,
  update,
  remove,
  removeAll,
};

export default services;

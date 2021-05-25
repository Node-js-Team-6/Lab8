import db from "../models/models.js";
import { getPagination } from "./pagination.js";

const Comment = db.comments;

function create(req, res) {
  // Validate request
  if (!req.body.text || !req.body.authorId) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a Comment
  const comment = new Comment({
    text: req.body.text,
    author: req.body.authorId,
  });

  //Save in the db
  comment
    .save(comment)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Comment.",
      });
    });
}

//Can also specify author and post filter
function findAll(req, res) {
  const { authorId, postId, page, size } = req.query;

  let condition = authorId ? { author: authorId } : {};
  if (postId) {
    condition.post = postId;
  }

  const { limit, offset } = getPagination(page, size);

  Comment.paginate(condition, { offset, limit })
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
        message:
          err.message || "Some error occurred while retrieving comments.",
      });
    });
}

function findOne(req, res) {
  const id = req.body.id;

  Comment.findById(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: "Not found Comment with id " + id,
        });
      } else {
        res.send(data);
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error retrieving Comment with id=" + id,
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

  Comment.findByIdAndModify(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Comment with id=${id}. Maybe Comment was not found!`,
        });
      } else {
        res.send({ message: "Comment was updated successfully." });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error updating Comment with id=" + id,
      });
    });
}

function remove(req, res) {
  const id = req.params.id;

  Comment.findByIdAndRemove(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Comment with id=${id}. Maybe Comment was not found!`,
        });
      } else {
        res.send({ message: "Comment was deleted successfully." });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error deleting Comment with id=" + id,
      });
    });
}

// Can pass author and post id
function removeAll(req, res) {
  const { authorId, postId } = req.body;
  let condition = authorId ? { author: authorId } : {};
  if (postId) {
    condition.post = postId;
  }

  Comment.deleteMany(condition)
    .then((data) => {
      res.send({
        message: `${data.deletedCount} Comments were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all posts.",
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

"use strict";

const commentController = require("../controllers/comments.controller");

const express = require("express");
const router = express.Router();

router.route("/:orgName/comments")
    .get(commentController.getComments)
    .post(commentController.postComment);

router.route("/:orgName")
    .delete(commentController.deleteOrgData);

module.exports = router;
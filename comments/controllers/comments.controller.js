"use strict";

const httpStatus = require('http-status-codes'),
      async = require("async");

const Comments = require("../model/comments");

const gitController = require("./github.controller");

exports.getComments = (req, res) => {

  let orgName = req.params.orgName;

  const query = {orgName: orgName};

  const projection = {"orgName": 0, "_id": 0};

  Comments.find(query, projection, (error, comments) => {
    if (error) {
      console.log("error:", error);
      return res.send("error!");
    }
    return res.json({
      comments: comments
    })
  });
}

exports.postComment = (req, res) => {

  let comment = req.body.comment && req.body.comment.trim();
  let orgName = req.params.orgName;

  if (!comment) {
    return res.status(httpStatus.BAD_REQUEST).json({error: "Please provide comment."});
  }

  async.series({
      checkGit : (callback) => {
          gitController.getOrgInfo(orgName, (error, orgId) => {
            if (error) {
              return callback(error);
            } else if (!orgId) {
              return callback("not_found");
            }
            return callback(null);
          });
      },
      insert: (callback) => {
          let newComment = new Comments({
            comment: comment,
            orgName: orgName
          });
          newComment.save((error) => {
            if (error) {
              return callback(error);
            }
            callback(null);
          });
      }
    }, (error) => {
      if (error === "not_found") {
        return res.status(httpStatus.NOT_FOUND).json({error: "Organization not found on GitHub."});
      }
      if (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({error: "Something went wrong!"});
      }
      return res.json({message: "Comment has been added."});
  });
}

// This should be shared among all microservices related to organization
exports.deleteOrgData = (req, res) => {

  let orgName = req.params.orgName;
  
  const query = {orgName: orgName};
  
  Comments.deleteMany(query, (error) => {
    if (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({error: "Something went wrong."});
    }
    res.json({message: "Successfully deleted organization data."});
  });

}
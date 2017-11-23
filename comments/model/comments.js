'use strict';
const mongoose = require('mongoose');

const commentObject = {
  comment: {
  	type: String,
  	require: true
  },
  orgName: {
    type: String,
    require: true
  }
};

const commentSchema = new mongoose.Schema(commentObject , { timestamps: true });
const commentModel = mongoose.model('Comment', commentSchema);

module.exports = commentModel;
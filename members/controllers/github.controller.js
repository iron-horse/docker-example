// TODO: This should be shared between two microservices
"use strict";

const async = require("async"),
      request = require('request');

const GIT_API_BASE_URL = "https://api.github.com";

const gitToken = process.env.GIT_API_TOKEN || "PROVIDE_GIT_TOKEN";

const git = request.defaults({
  headers: {
    'User-Agent': "Docker-Example-app",
    "Authorization": `token ${gitToken}`
  }
});

exports.getOrgMembers = (orgName, callback) => {

  let orgMemberUrl = `${GIT_API_BASE_URL}/orgs/${orgName}/members`;
  console.log(gitToken);
  git.get(orgMemberUrl, (error, response) => {
    if (error) {
      return callback(error);
    }
    if (response.statusCode !== 200 && response.statusCode === 404) {
      return callback("not_found");
    }
    let res = JSON.parse(response.body);
    callback(null, res);
  });
}

exports.getCount = (url, callback) => {
  git.get(url, (error, response) => {
    if (error) {
      return callback(error);
    }
    if (response.statusCode !== 200 && response.statusCode === 404) {
      return callback("not_found");
    }
    let res = JSON.parse(response.body);
    callback(null, res.length);
  });
}

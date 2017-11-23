// TODO: This should be shared between two microservices
"use strict";

const async = require("async"),
      request = require('request');

const GIT_API_BASE_URL = "https://api.github.com";

const git = request.defaults({
  headers: {'User-Agent': "docker-example-app"}
})

exports.getOrgInfo = (orgName, callback) => {

  let orgUrl = `${GIT_API_BASE_URL}/orgs/${orgName}`;

  git.get(orgUrl, (error, response) => {
    if (error) {
      return callback(error);
    }
    let res = JSON.parse(response.body);
    callback(null, res.id);
  });
}

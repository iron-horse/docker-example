"use strict";

const httpStatus = require('http-status-codes'),
      async = require("async");

const gitController = require("./github.controller");

/**
 * GET requests to /orgs/<org-name>/members/ should return an array of members of an organization (with their login, avatar url, the numbers of followers they have, and the number of people they’re following), sorted in descending order by the number of followers. 
 */


const getGitOrgMembersList = (orgName) => {
  return (callback) => {
    gitController.getOrgMembers(orgName, (error, members) => {
      if (error) {
        return callback(error);
      }
      callback(null, members);
    });
  }
};

const populateCounts = (members, callback) => {
  async.parallel(members.map(function(member) {
      let newMember = {
        login: member.login,
        avatar_url: member.avatar_url,
        followers_count: 0,
        following_count: 0
        }
      return getFollowersAndFollowingsCount(newMember, member.followers_url, member.following_url.replace("{/other_user}",""));
    }), (error, result) => {
      if (error) {
        return callback(error);
      }
      // console.log("Final Parallel Count result", result);
      callback(null, result); // final callback
    });
}

const getFollowersAndFollowingsCount = (member, followerURL, followingURL) => {
  return (callback) => {
    async.parallel([
      (callback) => {
        gitController.getCount(followerURL, (error, count) => {
          if (error) {
            return callback(error);
          }
          callback(null, count);
        });
      },
      (callback) => {
        gitController.getCount(followingURL, (error, count) => {
          if (error) {
            return callback(error);
          }
          callback(null, count);
        });
      }
    ], (error, results) => {
      if (error) {
        console.error("getFollowersOrFollowingsCount for ", member.login, error);
        return callback(error);
      }
      member.followers_count = results[0];
      member.following_count = results[1];
      return callback(null, member);
    });
  }
}

exports.getMembers = (req, res) => {
  async.waterfall([
    getGitOrgMembersList(req.params.orgName),
    populateCounts
  ], function(error, result) {
    if (error === "not_found") {
      return res.status(httpStatus.NOT_FOUND).json({error: "Organization not found"});
    }
    if (error) {
      console.error("Final callback error:", error);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({error: "Something went wrong"});
    }
    // sorted in descending order by the number of followers. 
    result.sort(function(a,b) {
      return b.followers_count - a.followers_count;
    });
    return res.json({ members: result });
  });
}
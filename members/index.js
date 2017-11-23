"use strict";

var server = require("./app");

/**
 * Start Express server.
 */
server.listen(server.get("port"), () => {
  console.log("Express server listening on port %d in %s mode", server.get("port"), server.get("env"));
});
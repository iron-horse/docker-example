"use strict";

const membersController = require("../controllers/members.controller");

const express = require("express");
const router = express.Router();

router.route("/:orgName/members")
    .get(membersController.getMembers);

module.exports = router;
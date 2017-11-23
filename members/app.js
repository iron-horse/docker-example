"use strict";

const express = require("express");
const cors = require("cors");

const logger = require("morgan");
const dotenv = require('dotenv');

const router = express.Router();

const app = new express();

dotenv.load({ path: '.env' });

app.set("port", process.env.PORT || 3000);

app.use(cors());
app.use(logger("dev"));

router.get("/", (req, res) => {
  res.send("Yay members!");
});

/**
 * Include Routes.
 */
const membersRoutes = require("./routes/members.routes");


/**
 * Register Routes.
 */

const API_VERSION = "/api/v1";
const BASE = "/orgs";

app.use(`${API_VERSION}`, router);
app.use(`${API_VERSION}${BASE}`, membersRoutes);

module.exports = app;
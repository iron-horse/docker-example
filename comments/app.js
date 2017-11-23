"use strict";

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const logger = require("morgan");
const dotenv = require('dotenv');

// connecting database mongoDB
const mongoose = require("mongoose");

const router = express.Router();

const app = new express();

/**
 * Connect to MongoDB.
 */
dotenv.load({ path: '.env' });

let dbURL = process.env.DB_URL || "mongodb://mongoDB/docker-example";

mongoose.connect(dbURL);

mongoose.connection.on("error", (error) => {
  console.log(error);
  console.error("MongoDB Connection Error. Please make sure that MongoDB is running.");
  process.exit(1);
});

app.set("port", process.env.PORT || 3000);

app.use(cors());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

router.get("/", (req, res) => {
  console.log("yay comments!");
  res.send("Yay comments!");
});

/**
 * Include Routes.
 */
const commentRoutes = require("./routes/comments.routes");


/**
 * Register Routes.
 */

const API_VERSION = "/api/v1";
const BASE = "/orgs";

app.use(`${API_VERSION}`, router);
app.use(`${API_VERSION}${BASE}`, commentRoutes);

module.exports = app;
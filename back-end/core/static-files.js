const express = require("express");

module.exports = (app) => {

  app.use("/node_modules", express.static("./node_modules"), (req, res, next) => {
    next();
  });
  app.use("/bower_components", express.static("./bower_components"), (req, res, next) => {
    next();
  });
  app.use(express.static("./front-end"), (req, res, next) => {
    next();
  });

};
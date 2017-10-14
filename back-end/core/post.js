const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");
const mongojs = require("mongojs");
const js = require("libraryjs");
const defaults = require("./defaults")();
const ajaxmanager = require("ajaxmanager");

module.exports = (app) => {

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));

  app.post("/ajax", (req, res, next) => {
    if (!js.check([
      [req, "body", "ajax"],
      [res]
    ])) {
      next();
      return;
    }
    
    //create ajax handler
    var ajax = ajaxmanager.create();
    ajax.set({
      req: req,
      res: res
    });

    //Use mongodb?
    if (ajax.import.mongo) mongodb(ajax);
    else ajaxRouter(ajax);
  });

  app.post("*", (req, res, next) => {
    res.send("404");
  });

};

function mongodb(ajax) {
  //connect to mongodb
  var db = mongojs( defaults.mongoServer );
  ajax.set({ db: db });

  db.on("error", (err) => {
    //connection fail
    ajax.error("mongoDB is offline");
  });
  db.on("connect", (err) => {
    //connected!
    ajaxRouter(ajax);
  });
  db.collection("connect").find((err) => {}); //Little trick to make .on("connect") work
}

function ajaxRouter(ajax) {
  const routesPath = path.join( process.cwd(), "/back-end/core/routes", ajax.import.ajax + ".js" );

  fs.exists(routesPath, (exists) => {
    if (exists) {
      require( routesPath )(ajax);
    }
    else {
      ajax.error("wrong ajax");
    }
  });
}
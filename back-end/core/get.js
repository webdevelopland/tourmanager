const path = require("path");
const fs = require("fs");

module.exports = (app) => {

  app.get("/db", (req, res, next) => {
    
    const indexPath = path.join( process.cwd() + "/back-end/response.json" );
    fs.exists(indexPath, (exists) => {
      if (exists) {
        res.sendFile( indexPath );
      }
      else {
        next();
      }
    });

  });

  app.get("*", (req, res) => {
    
    // Open index.html
    // If it doesn't exist send "404"
    
    const indexPath = path.join( process.cwd() + "/front-end/dist/app/bootstrap/index.html" );
    fs.exists(indexPath, (exists) => {
      if (exists) {
        res.sendFile( indexPath );
      }
      else {
        res.send("404");
      }
    });

  });

};
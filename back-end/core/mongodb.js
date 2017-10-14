const path = require("path");
const fs = require("fs");

const mlabPath = path.join( process.cwd(), "/back-end/private/mlab.json" );
if (fs.existsSync(mlabPath)) var mlab = require(mlabPath);
else var mlab = { error: true };

module.exports = () => {

  var mongodb = {};
  
  var islocal = false;
  if (mlab.error || islocal) {
    mongodb.mongoDbLocalPort = 8000;
    mongodb.mongoServer = `mongodb://127.0.0.1:${mongodb.mongoDbLocalPort}/local`;
  }
  else {
    mongodb.mongoServer = `mongodb://${mlab.user}:${mlab.password}@${mlab.server}`;
  }

  return mongodb;

};
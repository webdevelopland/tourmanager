const mongoshell = require("mongoshell");
const js = require("libraryjs");

var checkAdmin = (param) => {

  mongoshell.doc.find({
    ajax: param.ajax,
    query: {
      cookie: param.cookie
    },
    collection: "users",
    callback: (err, doc) => {
      if (err) {
        param.callback(false);
        return;
      }

      if (js.not(doc)) {
        //Does not exist user with the cookie
        param.callback(false);
        return;
      }

      //User found. Is that admin?
      if (doc.admin) {
        param.callback(true);
      }
      else {
        param.callback(false);
      }
    }
  });

};

var denied = (ajax) => {
  ajax.error("Access denied.");
}

module.exports = {
  admin: checkAdmin,
  denied: denied
};

// //How to use
// access.admin({
//   ajax: ajax,
//   cookie: cookie,
//   callback: (greenlight) => {
//     if (!greenlight) {
//       access.denied(ajax);
//       return;
//     }
//     //...
//   }
// });
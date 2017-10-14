const path = require("path");
const fs = require("fs");
const gulp = require("gulp");
const watch = require("gulp-watch");
const gulpsync = require("gulp-sync")(gulp);
const nodemon = require("gulp-nodemon");
const clean = require("gulp-clean");
const concat = require("gulp-concat");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const defaults = require( "./back-end/core/defaults" )();
const js = require("libraryjs");
const fcrypt = require("fcrypt");

gulp.task("default", ["clean"]);

// —————————————————————— Paths ——————————————————————
const backendPath = path.join( process.cwd(), "back-end" );
const frontendPath = path.join( process.cwd(), "front-end" );
const distPath = path.join( frontendPath, "dist" );
const appPath = path.join( frontendPath, "app" );
const cssPath = path.join( appPath, "/styles/css" );

// —————————————————————— Groups ——————————————————————
//auto compile scss files
gulp.task("scss-auto", gulpsync.sync([ "scss", "watch-scss" ]));

//express and autorefresh
gulp.task("express-auto", gulpsync.sync([ "watch-express" ]));

//—————————————————————— Delete compiled files ——————————————————————
gulp.task("clean", () => {
  return gulp.src([ distPath, cssPath ])
    .pipe(clean())
  ;
});

// —————————————————————— Express Server ——————————————————————
gulp.task("watch-express", () => {
  nodemon({
    script: "./express.js",
    watch:  "back-end"
  })
});

// —————————————————————— Compile ——————————————————————
var compileSass = () => {
  return gulp.src([
    path.join( process.cwd(), "/node_modules/@angular/material/_theming.scss" ), //Angular Material Themes Builder
    path.join( appPath, "/styles/default/*.scss" ), //    Default styles
    path.join( appPath, "/styles/global/**/*.scss" ), //  Global styles
    path.join( appPath, "/components/**/*.scss" ), //     Components styles
    path.join( appPath, "/routes/**/*.scss" ) //          Routes styles
  ])
    .pipe(concat("app.scss"))
    .pipe(sass()).on("error", sass.logError)
    .pipe(autoprefixer())
    .pipe(gulp.dest( cssPath ))
  ;
};

gulp.task("scss", () => {
  return compileSass();
});

// —————————————————————— Watching files updates ——————————————————————
gulp.task("watch-scss", () => {
  return watch(path.join( appPath, "/**/*.scss"), compileSass);
});

// —————————————————————— Encryption ——————————————————————
const privateData =     "./back-end/private.data";
const privateFolder =   "./back-end/private";

gulp.task("encrypt", () => {
  var loading = new js.Async();
  process.stdout.write("password: ");
  read( (password) => {
    fcrypt.encrypt({
      key: password,
      input: privateFolder,
      output: privateData,
      callback: (errors) => {
        if (errors.exists) errors.console();
        else console.log("encrypted");
        loading.set("true");
      }
    });
  });
  return loading;
});

gulp.task("decrypt", () => {
  var loading = new js.Async();
  process.stdout.write("password: ");
  read( (password) => {
    fcrypt.decrypt({
      key: password,
      input: privateData,
      output: privateFolder,
      callback: (errors) => {
        if (errors.exists) errors.console();
        else console.log("decrypted");
        loading.set("true");
      }
    });
  });
  return loading;
});

function read(callback) {
  process.stdin.setEncoding("utf8");

  process.stdin.on("readable", () => {
    var chunk = process.stdin.read();
    if (chunk !== null) {
      callback(chunk);
      process.stdin.end();
    }
  });

  process.stdin.on("end", () => {
    callback(null);
  });
}
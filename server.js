const LocalStrategy = require("passport-local").Strategy;
var express = require("express");
var app = express();
var port = process.env.PORT || 3000;
var mongoose = require("mongoose");
var passport = require("passport");
var flash = require("connect-flash");

var morgan = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var session = require("express-session");

var configDB = require("./config/database.js");

// configuration ===============================================================
mongoose.connect("mongodb://localhost:27017/tweetsDB", (err) => {
  if (err) {
    console.log("error occur", +err);
  } else {
    console.log("mongodb connected succesfully");
  }
}); // connect to our database

require("./config/passport")(passport); // pass passport for configuration

// setting up our application
app.use(morgan("dev"));
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs"); // set up ejs for templating

// required for passport
app.use(
  session({
    secret: "rohitsharma", // session secret
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes
require("./app/routes.js")(app, passport); // loading our routes and passing in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log("app is running on port " + port);

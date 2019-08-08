const express = require("express");
// const mysql = require("mysql");
const cors = require("cors");
const session = require("express-session");
const logger = require("morgan");
const passport = require("./config/passport");

const app = express();

const PORT = process.env.PORT || 3000;

const db = require("./models");

//passport shiet
// We need to use sessions to keep track of our user's login status
app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// app.use(express.static("public"));
app.use(cors());

require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);


db.sequelize.sync({ force: true }).then(function () {
  app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
  });
});


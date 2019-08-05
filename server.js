const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const passport = require("./config/passport");

const app = express();

const PORT = process.env.PORT || 3000;

const db = require("./models");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));
app.use(cors());

//api routes
app.get("/", (req, res) => {
  res.json("Hello World!");
})
//api news articles using categories
app.get("/api/:categories", (req, res) => {
  res.json("stuff");
})

db.sequelize.sync({ force: true }).then(function () {
  app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
  });
});

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const keys = {};
keys.secretOrKey = "Charizard";

const db = require("../models");


router.post("/api/login", (req, res) => {
  
  const newUser = {
    firstName: req.body.data.firstName,
    lastName: req.body.data.lastName,
    username: req.body.data.username,
    email: req.body.data.email,
    password: req.body.data.password
  };

  // Creating a custom method for our User model. This will check if an unhashed password entered by the user can be compared to the hashed password stored in our database
  newUser.prototype.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
  };
  // Hooks are automatic methods that run during various phases of the User Model lifecycle
  // In this case, before a User is created, we will automatically hash their password
  newUser.addHook("beforeCreate", function (user) {
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
  });

  
})
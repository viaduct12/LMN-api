const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const passport = require("passport");

const db = require("../../models");


router.post("/signup", (req, res, next) => {
  // console.log(req.body, "inside sign up");
  const newUser = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  };

  db.User.create(newUser).then(data => {

    const token = jwt.sign({
      userId: data.id,
      username: data.username,
      fullName: `${data.firstName} ${data.lastName}`,
    }, process.env.JWT_SECRET);

    console.log(token, "what is my token?")
    const result = {
      ...data,
      token
    };

    return res.json(newUser);
    }).catch(err => {
      if (err) {
        console.log(err);
        return res.json({ error: err.message });
      }
    })

  });

router.post("/login", (req, res) => {
  // console.log(req.body, "post userAuth.js");

  db.User.findOne({ where: { email: req.body.email } }).then(result => {

    if (bcrypt.compareSync(req.body.password, result.password)) {

      const token = jwt.sign({
        userId: result.id,
        username: result.username,
        fullName: `${result.firstName} ${result.lastName}`,
      }, process.env.JWT_SECRET);

      return res.json({
        userId: result.id,
        username: result.username,
        fullName: `${result.firstName} ${result.lastName}`,
        token: token
      });
    } else {
      console.log("not authenticated")
      return res.json({
        error: "Invalid username/password"
      });
    }}).catch(err => {
      console.log(err);
    });

});

//test route to see all users 
router.get("/users", (req, res) => {
  db.User.findAll({}).then(result => {
    res.json(result)
  })
})
module.exports = router;

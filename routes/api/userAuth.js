const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const passport = require("passport");

const db = require("../../models");


router.post("/signup", (req, res, next) => {

  const newUser = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  };

  db.User.create(newUser, (err, data) => {
    console.log(data.id, data.username, "inside user creation");
    if(err) console.log(err);

    const token = jwt.sign({
      userId: data.id,
      username: data.username,
      fullName: `${data.firstName} ${data.lastName}`,
    }, process.env.JWT_SECRET);

    const result = {
      ...data,
      token
    };

    return res.json(result);
    });

  });

router.post("/login", (req, res) => {
  console.log(req.body)

  db.User.findOne({ where: { username: req.body.username } }).then(result => {

    if (bcrypt.compareSync(req.body.password, res.password)) {

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

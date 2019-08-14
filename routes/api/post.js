const router = require("express").Router();
const db = require('../../models');

// api forum using all the categories 
router.post("/:category", (req, res) => {
  // const forumCategory = req.params.category;
const postObj = {
username: req.body.username,
topic: req.body.topic,
category: req.body.category,
description: req.body.description  
}

  db.Post.create(postObj, (err, data) => {

  }).then(result => {
    res.json(result);
  }).catch(err => console.log(err))
});




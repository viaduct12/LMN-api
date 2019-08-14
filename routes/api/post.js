const router = require("express").Router();
const db = require('../../models');

// api forum using all the categories 
router.post("/create", (req, res) => {
  // const forumCategory = req.params.category;
  // console.log(req.body, "server stuff");
const postObj = {
username: req.body.username,
topic: req.body.title,
category: req.body.category,
description: req.body.description  
}

  db.Post.create(postObj).then(result => {
    res.json(result);
  }).catch(err => console.log(err))
});


router.get("/get", (req, res) => {
  console.log(req.category);
  const getByCat = req.category;

  db.Post.findAll({
    where: {category : getByCat}
  }).then(result => {
    res.json(result);
  }).catch(err => console.log(err))
});

module.exports = router;


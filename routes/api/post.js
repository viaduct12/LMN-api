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

//api/post/get
router.get("/get/:category", (req, res) => {
  // console.log("hello", req);
  const getByCat = req.params.category;

  db.Post.findAll({
    where: {category : getByCat}
  }).then(result => {
    res.json(result);
  }).catch(err => console.log(err))
});

router.get("/get/:category/:id" , (req, res) => {
  const cat = req.params.category;
  const postId = req.params.id;

  db.Post.findOne({where: [{category: cat}, {id: postId}]
  }).then(result => {
    res.json(result);
  }).catch(err => console.log(err));
})

module.exports = router;


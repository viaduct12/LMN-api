const router = require("express").Router();
const db = require('../../models');
const jwtMiddleware = require("../../config/jwt-middleware/auth-middleware");

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

//api/post/all  for testing
router.get("/all", (req, res) => {

  db.Post.findAll({}).then(result => {
    res.json(result);
  }).catch(err => console.log(err))
})


//api/post/get
router.get("/get/:category", (req, res) => {
  // console.log("hello", req);
  const getByCat = req.params.category;

  db.Post.findAll({
    where: [{ category: getByCat }],
    order: [
      ["createdAt", "DESC"]
    ]
  }).then(result => {
    res.json(result);
  }).catch(err => console.log(err))
});

router.get("/get/:category/:id", (req, res) => {
  const cat = req.params.category;
  const postId = req.params.id;

  db.Post.findOne({
    where: [{ category: cat }, { id: postId }]
  }).then(result => {
    res.json(result);
  }).catch(err => console.log(err));
})

router.get("/recent", (req, res) => {
  const recentPost = [];
  const categories = ["announcements", "anime_gaming", "charities", "desing", "enviroment", "media", "movements", "politics", "podcasts", "sports", "technology"];

  const posts = categories.map(category => {
    return db.Post.findAll({
      where: [{ category: category }],
      order: [
        ["createdAt", "DESC"]
      ]
    }).then(result => {
      if (result[0] !== undefined) {
        recentPost.push(result[0].dataValues);
      }
    }).catch(err => console.log(err));
  })
  
  Promise.all(posts).then(results => {
    res.json(recentPost);
  });

})


module.exports = router;


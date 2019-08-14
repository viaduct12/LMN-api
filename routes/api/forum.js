const router = require("express").Router();
const db = require('../../models');

// api forum using all the categories 
router.get("/:category", (req, res) => {
  const forumCategory = req.params.category;
  db.Forum.findAll({where: {forumCategory: forumCategory}}).then(result => {
    res.json(result);
  })
});


module.exports = router;

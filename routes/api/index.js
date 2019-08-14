const router = require("express").Router();
const scrapeRoutes = require('./scrape');
const userRoutes = require("./userAuth");
const forumRoutes = require("./forum");
const postRoutes = require("./post");
// Register public auth api routes
router.use("/auth", userRoutes);

// Register book routes
router.use("/article", scrapeRoutes);

// router.use("/forum", forumRoutes);

router.use("/post", postRoutes);
module.exports = router;

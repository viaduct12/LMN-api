const router = require("express").Router();
const scrapeRoutes = require('./scrape');
const userRoutes = require("./userAuth");
const forumRoutes = require("./forum");
const postRoutes = require("./post");
const commentRoutes = require("./comment");
const testRoutes = require("./skyscanner");
// Register public auth api routes
router.use("/auth", userRoutes);

// Register book routes
router.use("/article", scrapeRoutes);

router.use("/forum", forumRoutes);

router.use("/post", postRoutes);

router.use("/comment", commentRoutes);

router.use("/flight", testRoutes);
module.exports = router;

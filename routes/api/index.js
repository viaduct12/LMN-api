const router = require("express").Router();
const scrapeRoutes = require('./scrape');
const userRoutes = require("./userAuth");

// Register public auth api routes
router.use("/auth", userRoutes);

// Register book routes
router.use("/article", scrapeRoutes);

module.exports = router;

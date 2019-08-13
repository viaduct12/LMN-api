const router = require("express").Router();
const db = require('../../models');
// const jwtMiddleware = require('../../lib/auth-middleware');
const cheerio = require("cheerio");
const axios = require("axios");

//api news articles using categories
router.get("/get/:categories", (req, res) => {
  const category = req.params.categories;
  db.Article.findAll({ where: { category: category } }).then(result => {
    res.json(result);
  })
});

//api get all articles
router.get("/all", (req, res) => {
  db.Article.findAll({}).then(result => {
    res.json(result);
  })
})

//scraping bbc and npr
router.get("/scrape/politics", (req, res) => {
  axios.get("https://www.npr.org/sections/news/").then(function (response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    const $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $("article").each(function (i, element) {
      // Save an empty result object
      const result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children("div")
        .children("div")
        .children("h2")
        .children("a")
        .text();

      result.summary = $(this)
        .children("div")
        .children("div")
        .children("p")
        .children("a")
        .text()

      result.link = $(this)
        .children("div")
        .children("div")
        .children("h2")
        .children("a")
        .attr("href");

      result.category = "politics";

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function (dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function (err) {
          // If an error occurred, log it
          console.log(err);
        });
    });

    // res.redirect("/");
  });

  axios.get("https://www.bbc.com/news/world/us_and_canada").then(function (response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $("article").each(function (i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.link = "https://www.bbc.com" +
        $(this)
          .children("header")
          .children("div")
          .children("h3")
          .children("a")
          .attr("href");
      result.title = $(this)
        .children("header")
        .children("div")
        .children("h3")
        .children("a")
        .children("span")
        .text();

      result.summary = $(this)
        .children("div")
        .children("div")
        .children("div")
        .children("div")
        .children("div")
        .children("p")
        .text();

      if (result.summary === "") {
        result.summary = $(this)
          .children("div")
          .children("div")
          .children("pre")
          .text();
      }

      result.category = "politics";

      // Create a new Article using the `result` object built from scraping
      if (result.title != "" && result.summary != "") {
        db.Article.create(result)
          .then(function (dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function (err) {
            // If an error occurred, log it
            console.log(err);
          });
      }
    });

    // Send a message to the client
    // res.redirect("/");
    res.json("all done!");
  });

});

//scraped medium
router.get("/scrape/technology", (req, res) => {
  axios.get("https://medium.com/topic/technology").then(function (response) {
    var $ = cheerio.load(response.data);
    $("section div div div").each(function (i, element) {
      var result = {};
      result.link = $(this)
        .children("h3")
        .children("a")
        .attr("href");
      result.title = $(this)
        .children("h3")
        .children("a")
        .text();
      result.summary = $(this)
        .children("div")
        .children("p")
        .children("a")
        .text()
      result.category = "technology";


      if (result.link !== undefined) {
        if (result.link.charAt(0) === "/") {
          result.link = "https://medium.com" +
            $(this)
              .children("h3")
              .children("a")
              .attr("href");
        }
      }


      db.Article.create(result).then((dbArticle) => {
        // view the added result in the console
        console.log(dbArticle);
      }).catch((err) => {
        console.log(err);
      });

    });
    // send a message to the client 
    res.redirect("/");
  });
})

//scraped kotaku and anime news network
router.get("/scrape/anime_gaming", (req, res) => {
  axios.get("https://kotaku.com/").then(function (response) {
    var $ = cheerio.load(response.data);
    $("article").each(function (i, element) {
      var result = {};
      result.link = $(this)
        .children("div")
        .children("div")
        .children("a")
        .attr("href");
      result.title = $(this)
        .children("div")
        .children("div")
        .children("a")
        .children("h1")
        .text();
      result.summary = $(this)
        .children("div")
        .children("div")
        .children("div")
        .children("p")
        .text()
      result.category = "anime_gaming";


      if (result.link !== undefined) {
        if (result.link.charAt(8) !== "k") {
          result.link = undefined;
        }
      }


      db.Article.create(result).then((dbArticle) => {
        // view the added result in the console
        // console.log(dbArticle);
      }).catch((err) => {
        // console.log(err);
      });

    });
    // send a message to the client 
    res.redirect("/");
  });

  axios.get("https://www.animenewsnetwork.com/").then(response => {
    var $ = cheerio.load(response.data);

    $("div").each(function (i, element) {
      var result = {};
      result.link = "https://www.animenewsnetwork.com" + $(this)
        .children("h3")
        .children("a")
        .attr("href");
      result.title = $(this)
        .children("h3")
        .children("a")
        .text();
      result.summary = $(this)
        .children("div")
        .children("span")
        .text()
      result.category = "anime_gaming";

      if (result.title !== "" && result.summary !== "") {
        db.Article.create(result).then((dbArticle) => {
          // view the added result in the console
          // console.log(dbArticle);
        }).catch((err) => {
          // console.log(err);
        });
      }
    });
    // send a message to the client 
    res.redirect("/");
  });
})

router.get("/scrape/sports", (req, res) => {
  axios.get("https://theundefeated.com/sports/").then(function (response) {
    var $ = cheerio.load(response.data);
    $("section").each(function (i, element) {
      var result = {};
      result.link = $(this)
        .children("a")
        .attr("href");
      result.title = $(this)
        .children("a")
        .children("h2")
        .text();
      result.summary = $(this)
        .children("a")
        .children("p")
        .text()
      result.category = "sports";

      if (result.title !== "" && result.summary !== "") {
        db.Article.create(result).then((dbArticle) => {
          // view the added result in the console
          console.log(dbArticle);
        }).catch((err) => {
          console.log(err);
        });
      }
    });
    // send a message to the client 
    res.redirect("/");
  });

})

router.get("/scrape/enviroment", (req, res) => {
  axios.get("https://earther.gizmodo.com/").then(function (response) {
    var $ = cheerio.load(response.data);
    $("article").each(function (i, element) {
      var result = {};
      result.link = $(this)
        .children("div")
        .children("div")
        .children("a")
        .attr("href");
      result.title = $(this)
        .children("div")
        .children("div")
        .children("a")
        .children("h1")
        .text();
      result.summary = $(this)
        .children("div")
        .children("div")
        .children("div")
        .children("p")
        .text()
      result.category = "enviroment";

      if (result.title !== "" && result.summary !== "") {
        db.Article.create(result).then((dbArticle) => {
          // view the added result in the console
          console.log(dbArticle);
        }).catch((err) => {
          console.log(err);
        });
      }
    });
    // send a message to the client 
    res.redirect("/");
  });

})

router.get("/scrape/design", (req, res) => {
  axios.get("https://www.entrepreneur.com/topic/home-decor").then(function (response) {
    var $ = cheerio.load(response.data);
    $(".block").each(function (i, element) {
      var result = {};
      result.link = $(this)
        .children("h3")
        .children("a")
        .attr("href");
      result.title = $(this)
        .children("h3")
        .children("a")
        .text();
      result.summary = $(this)
        .children("div")
        .text()
      result.category = "design";

      // if (result.title !== "" && result.summary !== "") {
      db.Article.create(result).then((dbArticle) => {
        // view the added result in the console
        console.log(dbArticle);
      }).catch((err) => {
        console.log(err);
      });
      // }
    });
    // send a message to the client 
    res.redirect("/");
  });

})

router.get("/scrape/media", (req, res) => {
  axios.get("https://www.independent.ie/style/celebrity/celebrity-news/").then(function (response) {
    var $ = cheerio.load(response.data);
    $("article").each(function (i, element) {
      var result = {};
      result.link = $(this)
        .children("a")
        .attr("href");
      result.title = $(this)
        .children("a")
        .children("h2")
        .children("span")
        .text();
      result.summary = $(this)
        .children("a")
        .children("p")
        .text()
      result.category = "media";

      if (result.title !== "" && result.summary !== "") {
        db.Article.create(result).then((dbArticle) => {
          // view the added result in the console
          console.log(dbArticle);
        }).catch((err) => {
          console.log(err);
        });
      }
    });
    // send a message to the client 
    res.redirect("/");
  });

})

router.get("/drop/:category", (req, res) => {
  const category = req.params.category;
  db.Article.destroy({ where: { category: category } }).then(result => {
    res.json("deleted");
  })
})


module.exports = router;

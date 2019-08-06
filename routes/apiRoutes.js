const db = require("../models");
const axios = require("axios");
const cheerio = require("cheerio");

module.exports = app => {

  //api news articles using categories
  app.get("/api/:categories", (req, res) => {
    const category = req.params.categories;
    db.Article.findAll({ where: { category: category } }).then(result => {
      res.json(result);
    })
  });

  //scraping bbc
  app.get("/scrape/politics", (req, res) => {
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
        result.link = $(this)
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

        if(result.summary === ""){
          result.summary = $(this)
            .children("div")
            .children("div")
            .children("pre")
            .text();
        }

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


        //dupe check ?

      //   db.Article.find({}).then(dbResult => {

      //     if (dbResult.length === 0) {
      //       // Create a new Article using the `result` object built from scraping
      //       db.Article.create(result)
      //         .then(function (dbArticle) {
      //           // View the added result in the console
      //           console.log(dbArticle);
      //         })
      //         .catch(function (err) {
      //           // If an error occurred, log it
      //           console.log(err);
      //         });
      //     } else {
      //       db.Article.update(result).then(dbResult => {
      //         console.log(dbResult, "update function");
      //       }).catch(err => {
      //         console.log(err);
      //       })
      //     }
      //   })

      });

      // Send a message to the client
      res.redirect("/");
    });



  });

  app.get("/scrape/technology", (req, res) => {
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

  app.get("/drop/:category", (req, res) => {
    const category = req.params.category;
    db.Article.destroy({ where: {category: category}}).then(result => {
      res.json("deleted");
    })
  })

}
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
//and ... tech crunch
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

  axios.get("https://techcrunch.com/").then(function (response) {
    var $ = cheerio.load(response.data);
    $(".post-block_title").each(function (i, element) {
      var result = {};
      result.link = $(this)
        .children("a")
        .attr("href");
      result.title = $(this)
        .children("a")
        .text();
      result.summary = $(this)
        .children("a")
        .text()
      result.category = "technology";


      if (result.link !== undefined) {
        if (result.link.charAt(0) === "/") {
          result.link = "https://techcrunch.com/" +
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

  axios.get("https://www.usatoday.com/sports/").then(function (response) {
    var $ = cheerio.load(response.data);
    $(".js-asset-link").each(function (i, element) {
      var result = {};
      result.link = $(this)
        .attr("href");
      result.title = $(this)
      .children("span") 
      .text();
      result.summary = $(this)
      .children("span") 
      .text();
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

  axios.get("https://climate.nasa.gov/news/?page=0&per_page=40&order=publish_date+desc%2C+created_at+desc&search=&category=19%2C98").then(function (response) {
    var $ = cheerio.load(response.data);
    $(".slide .list_text").each(function (i, element) {
      var result = {};
      result.link = $(this)
      .children(".content_title")
      .children("a")
      .attr("href");
      result.title = $(this)
      .children(".content_title")
      .children("a")
      .text();
      result.summary = $(this)
      .children(".article_teaser_body")
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

  axios.get("https://www.designboom.com/design/").then(function (response) {
    var $ = cheerio.load(response.data);
    $(".dboom-article-category").each(function (i, element) {
      var result = {};
      result.link = $(this)
        .children(".dboom-title")
        .children("a")
        .attr("href");
      result.title = $(this)
        .children(".dboom-title")
        .children("a")
        .text();
      result.summary = $(this)
        .children("dboom-excerpt")
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

  axios.get("https://m.eonline.com/news").then(function (response) {
    var $ = cheerio.load(response.data);
    $(".categorygrid__griditem categorygrid__griditem--small").each(function (i, element) {
      var result = {};
      result.link = $(this)
        .children("a")
        .attr("href");
      result.title = $(this)
        .children("a")
        .children(".categorygrid__griditemtext categorygrid__griditemtext--small")
        .children(".categorygrid__griditemtitle categorygrid__griditemtitle--small")
        .text();
      result.summary = $(this)
      .children("a")
      .children(".categorygrid__griditemtext categorygrid__griditemtext--small")
      .children(".categorygrid__griditemtitle categorygrid__griditemtitle--small")
      .text();

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

//*********** */

router.get("/scrape/finance", (req, res) => {
  axios.get("https://www.marketwatch.com/").then(function (response) {
    var $ = cheerio.load(response.data);
    $(".element1 element--article ").each(function (i, element) {
      var result = {};
      result.link = $(this)
        .children("div")
        .children(".article__content")
        .children(".article__headline")
        .children("a")
        .attr("href");

      result.title = $(this)
        .children("div")
        .children(".article__content")
        .children(".article__headline")
        .children("a")
        .text();
      result.summary = $(this)
        .children("div")
        .children(".article__content")
        .children(".article--secondary")
        .children(".list list--bullets")
        .children(".list__item")
        .children("a")
        .text()
      result.category = "finance";

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

  axios.get("https://www.ft.com/markets").then(function (response) {
    var $ = cheerio.load(response.data);
    $(".css-grid__item-top ").each(function (i, element) {
      var result = {};
      result.link = $(this)
        .children(".o-grid-row")
        .children(".js-track-scroll-event")
        .children(".o-teaser-collection")
        .children(".o-teaser o-teaser--article o-teaser--large o-teaser--has-image js-teaser")
        .children(".o-teaser__heading")
        .children("a")
        .attr("href");
      result.title = $(this)
        .children(".o-grid-row")
        .children(".js-track-scroll-event")
        .children(".o-teaser-collection")
        .children(".o-teaser o-teaser--article o-teaser--large o-teaser--has-image js-teaser")
        .children(".o-teaser__heading")
        .children("a")
        .text();
      result.summary = $(this)
      .children(".o-grid-row")
      .children(".js-track-scroll-event")
      .children(".o-teaser-collection")
      .children(".o-teaser o-teaser--article o-teaser--large o-teaser--has-image js-teaser")
      .children(".o-teaser__standfirst")
      .children("a")
      .text();
      
      result.category = "finance";

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


// router.get("/scrape/finance", (req, res) => {
//   axios.get("https://www.marketwatch.com/").then(function (response) {
//     var $ = cheerio.load(response.data);
//     $(".element1 element--article ").each(function (i, element) {
//       var result = {};
//       result.link = $(this)
//         .children("div")
//         .children(".article__content")
//         .children(".article__headline")
//         .children("a")
//         .attr("href");

//       result.title = $(this)
//         .children("div")
//         .children(".article__content")
//         .children(".article__headline")
//         .children("a")
//         .text();
//       result.summary = $(this)
//         .children("div")
//         .children(".article__content")
//         .children(".article--secondary")
//         .children(".list list--bullets")
//         .children(".list__item")
//         .children("a")
//         .text()
//       result.category = "finance";

//       if (result.title !== "" && result.summary !== "") {
//         db.Article.create(result).then((dbArticle) => {
//           // view the added result in the console
//           console.log(dbArticle);
//         }).catch((err) => {
//           console.log(err);
//         });
//       }
//     });
//     // send a message to the client 
//     res.redirect("/");
//   });

//   axios.get("https://www.ft.com/markets").then(function (response) {
//     var $ = cheerio.load(response.data);
//     $(".css-grid__item-top ").each(function (i, element) {
//       var result = {};
//       result.link = $(this)
//         .children(".o-grid-row")
//         .children(".js-track-scroll-event")
//         .children(".o-teaser-collection")
//         .children(".o-teaser o-teaser--article o-teaser--large o-teaser--has-image js-teaser")
//         .children(".o-teaser__heading")
//         .children("a")
//         .attr("href");
//       result.title = $(this)
//         .children(".o-grid-row")
//         .children(".js-track-scroll-event")
//         .children(".o-teaser-collection")
//         .children(".o-teaser o-teaser--article o-teaser--large o-teaser--has-image js-teaser")
//         .children(".o-teaser__heading")
//         .children("a")
//         .text();
//       result.summary = $(this)
//       .children(".o-grid-row")
//       .children(".js-track-scroll-event")
//       .children(".o-teaser-collection")
//       .children(".o-teaser o-teaser--article o-teaser--large o-teaser--has-image js-teaser")
//       .children(".o-teaser__standfirst")
//       .children("a")
//       .text();
      
//       result.category = "finance";

//       if (result.title !== "" && result.summary !== "") {
//         db.Article.create(result).then((dbArticle) => {
//           // view the added result in the console
//           console.log(dbArticle);
//         }).catch((err) => {
//           console.log(err);
//         });
//       }
//     });
//     // send a message to the client 
//     res.redirect("/");
//   });

// })

router.get("/scrape/movements", (req, res) => {
  axios.get("https://www.cfr.org/politics-and-government/political-movements").then(function (response) {
    var $ = cheerio.load(response.data);
    $(".card-article__container ").each(function (i, element) {
      var result = {};
      result.link = $(this)
        .children(".card-article__link-outer-wrapper")
        .children("a")
        .attr("href");

      result.title = $(this)
        .children(".card-article__topic-tag")
        .children("a")
        .text();
      result.summary = $(this)
        .children(".card-article__topic-tag")
        .children(".card-article__link-outer-wrapper")
        .children(".card-article__link")
        .children(".card-article__info")
        .children("p")
        .children("span")
        .text()
      result.category = "movements";

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

router.get("/scrape/charities", (req, res) => {
  axios.get("https://www.charitynavigator.org/index.cfm?bay=topten.detail&listid=148").then(function (response) {
    var $ = cheerio.load(response.data);
    $(".card-article__container ").each(function (i, element) {
      var result = {};
      result.link = $(this)
        .children("td")
        .children(".list-url-name")
        .attr("href");

      result.title = $(this)
        .children("td")
        .text();
      result.summary = $(this)
        .children("td")
        .children(".list-url-name")
        .text()
      result.category = "charities";

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

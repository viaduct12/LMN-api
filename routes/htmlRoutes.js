module.exports = app => {

  app.get("/", (req, res) => {
    res.json("Hello World!");
  });

  app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
  });

}
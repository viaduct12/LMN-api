module.exports = (seqeulize, DataTypes) => {
  const Article = seqeulize.define("Article", {
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    link: {
      type: DataTypes.STRING,
      allowNull: false
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  });


  Article.associate = models => {

    Article.belongsToMany(models.User, {
      as: "News",
      through: "peoples_news",
      foreignKey: "articleId"
    });
  }
  return Article;
}

module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define("Post", {

username: {
  type: DataTypes.STRING,
  allowNull: false
},

topic: {
  type: DataTypes.STRING,
  allowNull: false
},

category: {
  type: DataTypes.STRING,
  allowNull: false
},

description: {
  type: DataTypes.TEXT,
  allowNull: false
}


  });

Post.associate = models => {
  Post.hasMany(models.Forum, {
    as: "Topic",
    through: "category_topic",
    foreignKey: "forumId"
  });
} 

  return Post;
}
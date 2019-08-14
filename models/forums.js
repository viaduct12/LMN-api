module.exports = (sequelize, DataTypes) => {
  const Forum = sequelize.define("Forum", {

    category: {
      type: DataTypes.STRING,
      allowNull: false 
    }


  });

  Forum.associate = models => {
    Forum.hasOne(models.Post, {
      as: "Category",
      through: "category_topic",
      foreignKey: "postId"
    });
  }

  return Forum;
}
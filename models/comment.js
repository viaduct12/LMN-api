module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define("Comment", {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },

    body: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  });

  Comment.associate = models => {

    Comment.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });

    Comment.belongsTo(models.Post, {
      foreignKey: {
        allowNull: false
      }
    });
  }
  return Comment;
}
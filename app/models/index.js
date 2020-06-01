const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.emotions = require("./emotion.model")(sequelize, Sequelize);
db.articles = require("./article.model")(sequelize, Sequelize);
db.users = require("./user.model")(sequelize, Sequelize);
db.motivational_phrases = require("./motivational_phrase.model")(sequelize, Sequelize);
db.managers = require("./manager.model")(sequelize, Sequelize);
db.article_images = require("./article_image.model")(sequelize, Sequelize);
db.tasks = require("./task.model")(sequelize, Sequelize);


//Associations from here 

//Aricles - Emotions
db.emotions.belongsToMany(db.articles, {
  through: "article_emotion",
  as: "articles",
  foreignKey: "emotion_id"
});
db.articles.belongsToMany(db.emotions, {
  through: "article_emotion",
  as: "emotions",
  foreignKey: "article_id"
});

//Article images -  Articles
db.articles.hasMany(db.article_images, {
  as: "article_images"
});
db.article_images.belongsTo(db.articles, {
  as: "article"
});

//Emotions - Motivational phrases 
db.emotions.hasMany(db.motivational_phrases, {
  as: "motivational_phrases"
});
db.motivational_phrases.belongsTo(db.emotions, {
  as: "emotion"
});

//Users - Tasks
db.users.hasMany(db.tasks, {
  as: "tasks"
});
db.tasks.belongsTo(db.users, {
  as: "user"
});

module.exports = db;
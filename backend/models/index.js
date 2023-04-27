// SETUP LIBRARY
const Sequelize = require("sequelize")

// SETUP FILE
const dbConfig = require("../config/Database.js")
const prompt = require("./PromptModel.js")
const history = require("./HistoryModel.js")

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    },
    define: {
        timestamps: dbConfig.define.timestamps
    }
})

const db = {}
db.sequelize = sequelize
db.prompts = prompt(sequelize)
db.histories = history(sequelize)

module.exports = db
// SETUP LIBRARY
const Sequelize = require("sequelize")

module.exports = (sequelize) => {
    const Prompt = sequelize.define("Prompt", {
        Id : {
            type: Sequelize.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        Question: {
            type: Sequelize.TEXT("long"),
            unique: true,
            allowNull: false
        },
        Answer: {
            type: Sequelize.TEXT("long"),
            allowNull: false
        }
    })
    return Prompt
}
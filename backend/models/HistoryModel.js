// SETUP LIBRARY
const Sequelize = require("sequelize")

module.exports = (sequelize) => {
    const History = sequelize.define("History", {
        ChatId : {
            type: Sequelize.INTEGER.UNSIGNED,
            primaryKey: true
        },
        BubbleId : {
            type: Sequelize.INTEGER.UNSIGNED,
            primaryKey: true
        },
        Text: {
            type: Sequelize.TEXT("long"),
            allowNull: false
        },
        Sender: {
            type: Sequelize.ENUM('user','ai'),
            allowNull: false
        }
    })
    return History
}
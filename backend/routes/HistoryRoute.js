// SETUP LIBRARY
const express = require("express")

// SETUP FILE
const histories = require("../controllers/HistoryController")

module.exports = (app) => {
    const router = express.Router()

    router.post("/", histories.create)
    router.get("/:ChatId", histories.findInChatId)
    router.get("/", histories.findAll)
    router.patch("/:Id", histories.update)
    router.delete("/:Id", histories.delete)
    router.delete("/", histories.deleteAll)

    app.use("/api/histories", router)
}
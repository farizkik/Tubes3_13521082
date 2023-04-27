// SETUP LIBRARY
const express = require("express")

// SETUP FILE
const prompts = require("../controllers/PromptController.js")

module.exports = (app) => {
    const router = express.Router()

    router.post("/", prompts.create)
    router.get("/:Id", prompts.findOne)
    router.get("/", prompts.findAll)
    router.patch("/:Id", prompts.update)
    router.delete("/:Id", prompts.delete)
    router.delete("/", prompts.deleteAll)

    app.use("/api/prompts", router)
}
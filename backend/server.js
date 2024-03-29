// SETUP ENVIRONMENT VARIABLE
require("dotenv").config();

// SETUP LIBRARY
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

// SETUP DATABASE
const db = require("./models");
const promptRoutes = require("./routes/PromptRoute.js");
const historyRoutes = require('./routes/HistoryRoute')

// SETUP VARIABLE
const PORT = process.env.PORT;

// SETUP APPLICATION
const app = express();

app.use(
  cors({
    origin: "*"
  })
);

app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// SYNC DATABASE
db.sequelize.sync({}).then(() => {
  console.log("Drop and re-sync db.");
});

// ADD ROUTES
promptRoutes(app);
historyRoutes(app);

// PUT BACKEND ON PORT
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}.`);
});

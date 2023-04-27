// SETUP ENVIRONMENT VARIABLE
const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

// SETUP VARIABLE
const DATABASE_HOST = process.env.DATABASE_HOST;
const DATABASE_USER = process.env.DATABASE_USER;
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
const DATABASE_NAME = process.env.DATABASE_NAME;
const DATABASE_DIALECT = process.env.DATABASE_DIALECT;

module.exports = {
	HOST: DATABASE_HOST,
	USER: DATABASE_USER,
	PASSWORD: DATABASE_PASSWORD,
	DB: DATABASE_NAME,
	dialect: DATABASE_DIALECT,
	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000,
	},
	define: {
        timestamps: false
    }
}

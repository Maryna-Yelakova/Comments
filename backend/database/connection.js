var pgp = require("pg-promise")();
var dbConnectionString = process.env.PG_CONN;
var db = pgp(dbConnectionString);
module.exports = db;

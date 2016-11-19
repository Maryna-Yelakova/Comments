var db = require("./connection");
var comments = function() {
    this.getComments = function () {
         return db.query("select * from comments order by string_to_array(path::text,'.')::integer[] offset 0 limit 3;");
     }
};
module.exports = comments;
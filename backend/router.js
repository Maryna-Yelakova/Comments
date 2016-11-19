var comments = new(require("./database/comments.js"));
var apiPreff = "/api";
var path = require('path');
// var validate = new(require("./validate"));
var router = {
    init: function init(app) {
        app.get(apiPreff + "/comments", function (req, res) {
            comments.getComments().then(function (data) {
                res.status(200).send(data);
            }).catch(function (error) {
                res.status(500).send(error);
            });
        });
        app.get('*', function(req, res) {
            res.status(200).sendFile(path.resolve('frontend/app/index.html'));
        });

    }
};
module.exports = router;

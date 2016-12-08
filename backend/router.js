var comments = new(require("./database/comments.js"));
var apiPreff = "/api";
var path = require('path');
var validate = new(require("./database/validate"));
var multer = require("multer");
var mime = require("mime-types");
var requestIp = require('request-ip');
var useragent = require('useragent');
var commentStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./frontend/app/attachment");
    },
    filename: function(req, file, cb) {
        var filename = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 20; i++) {
            filename += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        cb(null, filename + '.' + mime.extension(file.mimetype));
    }
});
var uploadFile = multer({
    storage: commentStorage
});

var router = {
    init: function init(app) {
        app.get(apiPreff + "/comments/:page", function (req, res) {
            comments.getComments(req.params.page).then(function (data) {
                res.status(200).send(data);
            }).catch(function (error) {
                res.status(500).send(error);
            });
        });

        app.post(apiPreff + "/comment", function (req, res) {
            var agent = useragent.parse(req.headers['user-agent']);
            agent.browser = agent.family + ' ' + agent.major + '.' + agent.minor + '.' +agent.patch;
            var clientIp = requestIp.getClientIp(req);
            comments.saveComment(Object.assign({}, req.body, {ip:clientIp,browser:agent.browser}, req.params)).then(function (data) {
                res.status(200).send(data);
            }).catch(function (error) {
                res.status(500).send(error);
            });
        });

        app.get(apiPreff + "/commentsnumber", function (req, res) {
            comments.getCommentsNumber().then(function (data) {
                res.status(200).send(data);
            }).catch(function (error) {
                res.status(500).send(error);
            });
        });
        app.post(apiPreff + "/answer/:id", function(req, res) {
            var agent = useragent.parse(req.headers['user-agent']);
            agent.browser = agent.family + ' ' + agent.major + '.' + agent.minor + '.' +agent.patch;
            var clientIp = requestIp.getClientIp(req);
            comments.addEnclosedComments(Object.assign({}, req.body,{ip:clientIp,browser:agent.browser}, req.params)).then(function(data) {
                res.status(200).send(data);
            }).catch(function (error) {
                res.status(500).send(error);
            });
        });
        app.get(apiPreff + "/sortedcomments/sortby/:sortparam/orderby/:arrow/showpage/:page", function (req, res) {
            comments.getSortComments(req.params.sortparam,req.params.arrow,req.params.page).then(function (data) {
                res.status(200).send(data);
            }).catch(function (error) {
                res.status(500).send(error);
            });
        });
        app.post(apiPreff + "/commentwithfile", uploadFile.any(), function(req, res) {
            var agent = useragent.parse(req.headers['user-agent']);
            agent.browser = agent.family + ' ' + agent.major + '.' + agent.minor + '.' +agent.patch;
            var clientIp = requestIp.getClientIp(req);
            comments.saveComment(Object.assign({
                attachment: req.files[0].filename
            }, req.body, req.params,{ip:clientIp,browser:agent.browser})).then(function() {
                res.status(200).end();
            }).catch(function(error) {
                res.status(500).send(error);
            });
        });
        app.post(apiPreff + "/answerwithfile/:id", uploadFile.any(), function(req, res) {
            var agent = useragent.parse(req.headers['user-agent']);
            agent.browser = agent.family + ' ' + agent.major + '.' + agent.minor + '.' +agent.patch;
            var clientIp = requestIp.getClientIp(req);
            comments.addEnclosedComments(Object.assign({
                attachment: req.files[0].filename
            }, req.body, req.params,{ip:clientIp,browser:agent.browser})).then(function() {
                res.status(200).end();
            }).catch(function(error) {
                res.status(500).send(error);
            });
        });
        

        app.get('*', function (req, res) {
            res.status(200).sendFile(path.resolve('frontend/app/index.html'));
        });
    }
};
module.exports = router;

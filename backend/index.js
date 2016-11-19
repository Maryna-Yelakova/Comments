var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var router = require('./router.js');
app.set('port', (process.env.PORT || 3000));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(__dirname + '/../frontend/app'));
app.use('/bower_components',  express.static(__dirname + '/../bower_components'));
app.listen(app.get('port'), function () {
    console.log('Example app listening on port 3000!');
});
router.init(app);



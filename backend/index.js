var express = require('express');
var app = express();
app.set('port', (process.env.PORT || 3000));
app.use(express.static(__dirname + '/../frontend/app'));
app.use('/bower_components',  express.static(__dirname + '/../bower_components'));
app.listen(app.get('port'), function () {
    console.log('Example app listening on port 3000!');
});


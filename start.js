var express = require('express');
var cors = require('cors');
var request = require('request');
var app = express();
var bodyParser = require('body-parser');
var cool = require('cool-ascii-faces');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('port', (process.env.PORT || 3000));

app.get('/', function(request, response) {
    response.render('pages/index')
});

app.get('/cool', function(request, response) {
    response.send(cool());
});
app.post('/getData', function (req, res) {
    console.log(JSON.stringify(req.body));
    request(req.body.url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body)
            // do more stuff
            res.send(info);
        }
    })
});
app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
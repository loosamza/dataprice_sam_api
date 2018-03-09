var express = require('express');
var cors = require('cors');
var request = require('request');
var app = express();
var bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cors());
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
app.listen(3000);
console.log("The server is now running on port 3000.");
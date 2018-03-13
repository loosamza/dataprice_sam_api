var express = require('express');
var cors = require('cors');
var request = require('request-promise');
var app = express();
var bodyParser = require('body-parser');
var cool = require('cool-ascii-faces');
var await = require('await');
var async = require('async');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(cors());
app.use('/node_modules', express.static(__dirname + '/node_modules/'));
app.use('/static', express.static(__dirname + '/static/'));
// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.set('port', (process.env.PORT || 3000));

app.get('/', (request, response) => {
  response.render('index.html')
});

app.get('/cool', (request, response) => {
  response.send(cool());
});
app.post('/getData', (req, res) => {
  console.log(JSON.stringify(req.body));
  request(req.body.url, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body)
      // do more stuff
      res.send(info);
    }
  })
});
const bxUrl = 'https://bx.in.th/api/';
const crytopiaUrl = ''
let crytoTypeList = [];
let bxData;

const callCustomApi = async (urlBuilder) => {
  let response
  try {
    response = await  request(urlBuilder);
    var data = JSON.parse(response);
    return response;
  } catch (err) {
    console.log('Http error', err);
    return false;
  }
}
const getCryptoType = async () => {
  let response
  try {
    response = await request(bxUrl);
    var data = JSON.parse(response);

    for (var key in data) {
      if (data[key].primary_currency === 'THB') {
        crytoTypeList.push(data[key]);
      }
    }

    return crytoTypeList;

  } catch (err) {
    console.log('Http error', err);
    return false;
  }
}
app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});

getCryptoType().then((response) => {
  if (response) {
    response.forEach((value) => {

      // Call Bx orderbook
      callCustomApi("https://bx.in.th/api/orderbook/?pairing="
          + value.pairingId).then((bxRes) => {
        let bxRes = JSON.parse(bxRes);
        console.log(typeof  bxRes);
      })

      //console.log(value.secondary_currency);
    });
  }
});

"use strict"

var express = require('express'); //
var app = express(); //
//// var server = require('http').createServer(app);
//// var port = process.argv[2] || 5000;

app.listen(process.env.PORT || 5000, function () {
    console.log('Server listening');
    ////console.log('Server listening at port %d', port);
    ////console.log('Server dirname : ', __dirname);
});

var bodyParser = require('body-parser'); //
//// app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); //
app.use(bodyParser.urlencoded({ extended: true })); //


var fs = require('fs');
var obj = JSON.parse(fs.readFileSync('info.json', 'utf8'));

console.log('Answer: ' + obj['금동신발']['재질']); //// debugging

// app.post('/', function(req, res){
//   var speech = 
//       req.body.queryResult &&
//       req.body.queryResult.parameters &&
//       req.body.queryresult.parameters.echoText  
//       ? req.body.queryresult.parameters.echoText  
//       : "Seems like some problem. Speak again.";
//   return res.json({
//     speech: speech,
//     displayText: speech,
//     source: "museum-bot"
//   });
// });


//app.all('/', function(req, res){
//app.get('/', function(req, res){

app.post('/', function (request, response) {
    console.log('request: \n' + JSON.stringify(request.body));
    //var item = req.body.result.parameters['item'];
    var item = request.body.queryResult.parameters['item'];
    var material = request.body.queryResult.parameters['material'];
    var size = request.body.queryResult.parameters['size'];
    var discover_time = request.body.queryResult.parameters['discoverTime'];

    let action = (request.body.queryResult.action) ? request.body.queryResult.action: 'default';


    const actionHandlers = {
        'get.item': () => {
            let responseToUser = { fulfillmentText: item+'에 대해 알려드릴게요. 무엇이 궁금하신가요?'};
            sendResponse(responseToUser);
        },
        'get.item.name': () => {
            let responseToUser = { fulfillmentText: '답변입니다.' + obj[item][name] };
            sendResponse(responseToUser);
        },
        'get.item.size': () => {
            let responseToUser = { fulfillmentText: '답변입니다.' + obj[item][size] };
            sendResponse(responseToUser);
        },
        'get.item.material': () => {
            let responseToUser = { fulfillmentText: '답변입니다.' + obj[item][material] };
            sendResponse(responseToUser);
        },
        'get.item.discoverTime': () => {
            let responseToUser = { fulfillmentText: '답변입니다.' + obj[item][discoverTime] };
            sendResponse(responseToUser);
        },
        'default': () => {
            let responseToUser = { fulfillmentText: '디폴트 액션 처리' };
            sendResponse(responseToUser);
        }
    };

    if (!actionHandlers[action]) {
         action = 'default';
    }

    actionHandlers[action]();

    function sendResponse(responseToUser) {
        if (typeof responseToUser === 'string') {
            let responseJson = { fulfillmentText: responseToUser };
            response.json(responseJson);
        }
        else {
            let responseJson = {};
            responseJson.fulfillmentText = responseToUser.fulfillmentText;
            if (responseToUser.fulfillmentMessages) {
                responseJson.fulfillmentMessages = responseToUser.fulfillmentMessages;
            }
            if (responseToUser.outputContexts) {
                responseJson.outputContexts = responseToUser.outputContexts;
            }
            response.json(responseJson);
        }
    }
});

//var output = "답변드립니다. " + obj[item][size];

////res.setHeader('Content-Type', 'application/json');
////res.send(JSON.stringify({'speech': output, 'displayText': output}));


// return res.json({
//     fulfillmentText: output,
//     source: "museum-bot"
// });
// });

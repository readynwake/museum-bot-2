"use strict"

var express = require('express'); //
var app = express(); //


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

app.post('/', function (request, response) {
    console.log('request: \n' + JSON.stringify(request.body));
    //var item = req.body.result.parameters['item'];
    var what = request.body.queryResult.parameters['what'];
    var who = request.body.queryResult.parameters['who'];
    var when = request.body.queryResult.parameters['when'];
    var where = request.body.queryResult.parameters['where'];
    var how = request.body.queryResult.parameters['how'];
    var why = request.body.queryResult.parameters['why'];

    let action = (request.body.queryResult.action) ? request.body.queryResult.action: 'default';


    const actionHandlers = {
        'what.how': () => {
            let responseToUser = { fulfillmentText: '답변드립니다. ' + obj[what][how]};
            sendResponse(responseToUser);
        },
   
        'default': () => {
            let responseToUser = { fulfillmentText: '아직 입력되지 않은 질문입니다.' };
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


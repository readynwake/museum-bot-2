"use strict"

var express = require('express'); //
var app = express(); //


app.listen(process.env.PORT || 5000, function () {
    console.log('Server listening');

});

var bodyParser = require('body-parser'); //

app.use(bodyParser.json()); //
app.use(bodyParser.urlencoded({ extended: true })); //


var fs = require('fs');
var obj = JSON.parse(fs.readFileSync('info.json', 'utf8'));

console.log('Answer: ' + obj['경주봉황대']['정의']); //// debugging

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
            let responseToUser = { fulfillmentText: obj[what][how]};
            sendResponse(responseToUser);
        },

        'what.how.why': () => {
            let responseToUser = { fulfillmentText: obj[what][how][why]};
            sendResponse(responseToUser);
        },

        'what.when.how': () => {
            let responseToUser = { fulfillmentText: obj[what][when][how]};
            sendResponse(responseToUser);
        },
        
                
        'what.where.how': () => {
            let responseToUser = { fulfillmentText: obj[what][where][how]};
            sendResponse(responseToUser);
        },
        
        
        'what.who': () => {
            let responseToUser = { fulfillmentText: obj[what][who]};
            sendResponse(responseToUser);
        },
       
        'what.who.how': () => {
            let responseToUser = { fulfillmentText: obj[what][who][how]};
            sendResponse(responseToUser);
        },

          
        
        'default': () => {
            let responseToUser = { fulfillmentText: '죄송합니다. 정보가 없는 내용입니다. 다른 궁금한건 없으신가요?' };
            sendResponse(responseToUser);
        }
    };

    if (!actionHandlers[action]) {
         action = 'default';
    }

    actionHandlers[action]();

    function sendResponse(responseToUser) {
        // if (typeof responseToUser === 'string')
        if (responseToUser == "경상북도 김천시 교동에 있는 조선시대의 정자입니다. "
        {
            let responseJson = { fulfillmentText: responseToUser };
            response.json(responseJson);
        }
        
        else if (responseToUser == "undefined")
        {
            let responseJson = { fulfillmentText: 'DB에 없는내용' };
            response.json(responseJson);
        }
        
        else
        {
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


'use strict';

const ALEXA_APP_ID = 'amzn1.ask.skill.app.your-skill-id';
const APIAI_DEVELOPER_ACCESS_TOKEN = 'your-apiai-developer-access-token';

var AlexaSdk = require('alexa-sdk');
var ApiAiSdk = require('apiai');
var ApiAi = ApiAiSdk(APIAI_DEVELOPER_ACCESS_TOKEN);

var alexaSessionId;

exports.handler = function (event, context) {
    var alexa = AlexaSdk.handler(event, context);
    alexa.appId = ALEXA_APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        var self = this;
        setAlexaSessionId(self.event.session.sessionId);
        ApiAi.eventRequest({name: 'WELCOME'}, {sessionId: alexaSessionId})
            .on('response', function (response) {
                var speech = response.result.fulfillment.speech;
                self.emit(':ask', speech, speech);
            })
            .on('error', function (error) {
                console.error(error.message);
                self.emit(':tell', error);
            })
            .end();
    },
    'ApiIntent': function () {
        var self = this;
        var text = self.event.request.intent.slots.Text.value;
        setAlexaSessionId(self.event.session.sessionId);
        if (text) {
            ApiAi.textRequest(text, {sessionId: alexaSessionId})
                .on('response', function (response) {
                    var speech = response.result.fulfillment.speech;
                    if (isResponseIncompleted(response)) {
                        self.emit(':ask', speech, speech);
                    } else {
                        self.emit(':tell', speech);
                    }
                })
                .on('error', function (error) {
                    console.error(error.message);
                    self.emit(':tell', error.message);
                })
                .end();
        } else {
            self.emit('Unhandled');
        }
    },
    'AMAZON.CancelIntent': function () {
        this.emit('AMAZON.StopIntent');
    },
    'AMAZON.HelpIntent': function () {
        this.emit('Unhandled');
    },
    'AMAZON.StopIntent': function () {
        var self = this;
        ApiAi.eventRequest({name: 'BYE'}, {sessionId: alexaSessionId})
            .on('response', function (response) {
                self.emit(':tell', response.result.fulfillment.speech);
            })
            .on('error', function (error) {
                console.error(error.message);
                self.emit(':tell', error.message);
            })
            .end();
    },
    'Unhandled': function () {
        var self = this;
        ApiAi.eventRequest({name: 'FALLBACK'}, {sessionId: alexaSessionId})
            .on('response', function (response) {
                var speech = response.result.fulfillment.speech;
                self.emit(':ask', speech, speech);
            })
            .on('error', function (error) {
                console.error(error.message);
                self.emit(':tell', error.message);
            })
            .end();
    }
};

function isResponseIncompleted(response) {
    if (response.result.actionIncomplete) {
        return true;
    }

    for (var i = 0; i < response.result.contexts.length; i++) {
        if (response.result.contexts[i].lifespan > 1) {
            return true;
        }
    }
    return false;
}

function setAlexaSessionId(sessionId) {
    if (sessionId.indexOf("amzn1.echo-api.session.") != -1) {
        alexaSessionId = sessionId.split('amzn1.echo-api.session.').pop();
    } else {
        alexaSessionId = sessionId.split('SessionId.').pop();
    }
}

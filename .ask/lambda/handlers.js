const Alexa = require('ask-sdk-core');
const util = require('./util'); // utility functions
const logic = require('./logic'); // this file encapsulates all "business" logic
const constants = require('./constants'); // constants such as specific service permissions go here
const datasources = require('./documents/datasources');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        console.log('LaunchRequestHandler mark')
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        const day = sessionAttributes['day'];
        const monthName = sessionAttributes['monthName'];
        const name = sessionAttributes['name'] || '';
        const sessionCounter = sessionAttributes['sessionCounter'];
        sessionAttributes['firstTurn'] = true;

        const dateAvailable = day && monthName;
        if (dateAvailable){
            // we can't use intent chaining because the target intent is not dialog based
            return SayAnniversaryIntentHandler.handle(handlerInput);
        }

        let speechText = !sessionCounter ? handlerInput.t('WELCOME_MSG', {name: name}) : handlerInput.t('WELCOME_BACK_MSG', {name: name});
        speechText += handlerInput.t('MISSING_MSG');
        speechText += handlerInput.t('POST_SAY_HELP_MSG');

        // we use intent chaining to trigger the anniversary registration multi-turn
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(handlerInput.t('REPROMPT_MSG'))
            .getResponse();
    }
};

const RegisterAnniversaryIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RegisterAnniversaryIntent';
    },
    handle(handlerInput) {
        console.log('RegisterAnniversaryIntentHandler mark')
        const {attributesManager, requestEnvelope} = handlerInput;
        // the attributes manager allows us to access session attributes
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = requestEnvelope.request;
        if (intent.confirmationStatus === 'CONFIRMED') {
            console.log('confirmationStatus = CONFIRMED')
            const day = Alexa.getSlotValue(requestEnvelope, 'day');
            // we get the slot instead of the value directly as we also want to fetch the id
            const monthSlot = Alexa.getSlot(requestEnvelope, 'month');
            const monthName = monthSlot.value;
            const month = monthSlot.resolutions.resolutionsPerAuthority[0].values[0].value.id; //MM
            
            sessionAttributes['day'] = day;
            sessionAttributes['month'] = month; //MM
            sessionAttributes['monthName'] = monthName;
            // we can't use intent chaining because the target intent is not dialog based
            console.log('registering new date: '+`${month} (${monthName}) ${day}`)
            return SayAnniversaryIntentHandler.handle(handlerInput);
        }
        return handlerInput.responseBuilder
            .speak(handlerInput.t('REJECTED_MSG'))
            .reprompt(handlerInput.t('REPROMPT_MSG'))
            .getResponse();
    }
};

const SayAnniversaryIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'SayAnniversaryIntent';
    },
    handle(handlerInput) {
        console.log('SayAnniversaryIntentHandler mark')
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        const firstTurn = sessionAttributes['firstTurn'];
        const sessionCounter = sessionAttributes['sessionCounter'];
        const day = sessionAttributes['day'];
        const month = sessionAttributes['month']; //MM
        const monthName = sessionAttributes['monthName'];
        const name = sessionAttributes['name'] || '';
        let timezone = sessionAttributes['timezone'];

        let speechText = '', isAnniv = false;
        console.log('first turn: '+firstTurn)
        if (firstTurn){
            if (sessionCounter > 0){
                speechText += handlerInput.t('WELCOME_BACK_MSG');
            } else {
                speechText += handlerInput.t('WELCOME_MSG');
            }
            sessionAttributes['firstTurn'] = false;
        }
        console.log('speach text for SayAnniv: '+speechText)
        const dateAvailable = day && month ;
        if (dateAvailable){
            if (!timezone){
                timezone = 'Europe/Rome';  // so it works on the simulator, you should uncomment this line, replace with your time zone and comment sentence below
                //return handlerInput.responseBuilder
                //    .speak(handlerInput.t('NO_TIMEZONE_MSG'))
                //    .getResponse();
            }
            const annivData = logic.getAnnivData(day, month, timezone);
            sessionAttributes['daysLeft'] = annivData.daysUntilAnniv;
            speechText += handlerInput.t('DAYS_LEFT_MSG', {name: name, count: annivData.daysUntilAnniv, monthName: monthName, day: day});
            isAnniv = annivData.daysUntilAnniv === 0;
            if (isAnniv) { // it's the user's Anniv!
                speechText = handlerInput.t('GREET_MSG', {name: name});
                const adjustedDate = logic.getAdjustedDate(timezone);
                console.log('adjusted date: '+adjustedDate)
            }
            speechText += handlerInput.t('POST_SAY_HELP_MSG');

            // Add APL directive to response
            if (util.supportsAPL(handlerInput)) {

                handlerInput.responseBuilder.addDirective({
                    type: 'Alexa.Presentation.APL.RenderDocument',
                    version: '1.1',
                    document: constants.APL.sayAnnivDate,
                    datasources: datasources.sayAnnivDateDS(monthName, day, isAnniv)
                });
            }

        } else {
            speechText += handlerInput.t('MISSING_MSG');
            // we use intent chaining to trigger the anniversary registration multi-turn
            handlerInput.responseBuilder.addDelegateDirective({
                name: 'RegisterAnniversaryIntent',
                confirmationStatus: 'NONE',
                slots: {}
            });
        }

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(handlerInput.t('REPROMPT_MSG'))
            .getResponse();
    }
};

const FunFactIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'FunFactIntent';
    },
    handle(handlerInput) {
        console.log('FunFactIntentHandler mark')
        const speechText = handlerInput.t('FUN_FACT_INTRO_MSG');
        const sel_Fact = handlerInput.t('FUN_FACT_MSG_lst');

        // Add APL directive to response
        if (util.supportsAPL(handlerInput)) {

            handlerInput.responseBuilder.addDirective({
                type: 'Alexa.Presentation.APL.RenderDocument',
                version: '1.1',
                document: constants.APL.funFact,
                datasources: datasources.funFactDS(speechText, sel_Fact)
            });
        }

        return handlerInput.responseBuilder
            .speak(speechText + sel_Fact)
            .reprompt(handlerInput.t('REPROMPT_MSG'))
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        console.log('HelpIntentHandler mark')
        const speechText = handlerInput.t('HELP_MSG');

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        console.log('CancelAndStopIntentHandler mark')
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const name = sessionAttributes['name'] || '';
        const speechText = handlerInput.t('GOODBYE_MSG', {name: name});

        return handlerInput.responseBuilder
            .speak(speechText)
            .withShouldEndSession(true) // session can remain open if APL doc was rendered
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        console.log('FallbackIntentHandler mark')
        const speechText = handlerInput.t('FALLBACK_MSG');

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(handlerInput.t('REPROMPT_MSG'))
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        console.log('SessionEndedRequestHandler mark')
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speechText = handlerInput.t('REFLECTOR_MSG', {intent: intentName});

        return handlerInput.responseBuilder
            .speak(speechText)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speechText = handlerInput.t('ERROR_MSG');
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(handlerInput.t('REPROMPT_MSG'))
            .getResponse();
    }
};

module.exports = {
    LaunchRequestHandler,
    RegisterAnniversaryIntentHandler,
    SayAnniversaryIntentHandler,
    FunFactIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    FallbackIntentHandler,
    SessionEndedRequestHandler,
    IntentReflectorHandler,
    ErrorHandler
}
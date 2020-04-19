const Alexa = require('ask-sdk-core');
const util = require('./util'); // utility functions
const logic = require('./logic'); // this file encapsulates all "business" logic
const constants = require('./constants'); // constants such as specific service permissions go here

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        const day = sessionAttributes['day'];
        const monthName = sessionAttributes['monthName'];
        const year = sessionAttributes['year'];
        const name = sessionAttributes['name'] || '';
        const sessionCounter = sessionAttributes['sessionCounter'];

        const dateAvailable = day && monthName && year;
        if (dateAvailable){
            // we can't use intent chaining because the target intent is not dialog based
            return SayAnniversaryIntentHandler.handle(handlerInput);
        }

        let speechText = !sessionCounter ? handlerInput.t('WELCOME_MSG', {name: name}) : handlerInput.t('WELCOME_BACK_MSG', {name: name});
        speechText += handlerInput.t('MISSING_MSG');

        // we use intent chaining to trigger the birthday registration multi-turn
        return handlerInput.responseBuilder
            .speak(speechText)
            // we use intent chaining to trigger the birthday registration multi-turn
            .addDelegateDirective({
                name: 'RegisterBirthdayIntent',
                confirmationStatus: 'NONE',
                slots: {}
            })
            .getResponse();
    }
};

const RegisterAnniversaryIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RegisterAnniversaryIntent';
    },
    handle(handlerInput) {
        const {attributesManager, requestEnvelope} = handlerInput;
        // the attributes manager allows us to access session attributes
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = requestEnvelope.request;

        if (intent.confirmationStatus === 'CONFIRMED') {
            const day = Alexa.getSlotValue(requestEnvelope, 'day');
            const year = Alexa.getSlotValue(requestEnvelope, 'year');
            // we get the slot instead of the value directly as we also want to fetch the id
            const monthSlot = Alexa.getSlot(requestEnvelope, 'month');
            const monthName = monthSlot.value;
            const month = monthSlot.resolutions.resolutionsPerAuthority[0].values[0].value.id; //MM

            sessionAttributes['day'] = day;
            sessionAttributes['month'] = month; //MM
            sessionAttributes['monthName'] = monthName;
            sessionAttributes['year'] = year;
            // we can't use intent chaining because the target intent is not dialog based
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
    async handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        const day = sessionAttributes['day'];
        const month = sessionAttributes['month']; //MM
        const year = sessionAttributes['year'];
        const name = sessionAttributes['name'] || '';
        let timezone = sessionAttributes['timezone'];

        let speechText = '', isBirthday = false;
        const dateAvailable = day && month && year;
        if (dateAvailable){
            if (!timezone){
                timezone = 'Europe/Rome';  // so it works on the simulator, you should uncomment this line, replace with your time zone and comment sentence below
                //return handlerInput.responseBuilder
                //    .speak(handlerInput.t('NO_TIMEZONE_MSG'))
                //    .getResponse();
            }
            const birthdayData = logic.getBirthdayData(day, month, year, timezone);
            sessionAttributes['age'] = birthdayData.age;
            sessionAttributes['daysLeft'] = birthdayData.daysUntilBirthday;
            speechText = handlerInput.t('DAYS_LEFT_MSG', {name: name, count: birthdayData.daysUntilBirthday});
            speechText += handlerInput.t('WILL_TURN_MSG', {count: birthdayData.age + 1});
            isBirthday = birthdayData.daysUntilBirthday === 0;
            if (isBirthday) { // it's the user's birthday!
                speechText = handlerInput.t('GREET_MSG', {name: name});
                speechText += handlerInput.t('NOW_TURN_MSG', {count: birthdayData.age});
                const adjustedDate = logic.getAdjustedDate(timezone);
                // we'll now fetch celebrity birthdays from an external API
                const response = await logic.fetchBirthdays(adjustedDate.day, adjustedDate.month, constants.MAX_BIRTHDAYS);
                console.log(JSON.stringify(response));
                // below we convert the API response to text that Alexa can read
                const speechResponse = logic.convertBirthdaysResponse(handlerInput, response, false);
                speechText += speechResponse;
            }
            speechText += handlerInput.t('POST_SAY_HELP_MSG');

            // Add APL directive to response
            if (util.supportsAPL(handlerInput)) {
                const {Viewport} = handlerInput.requestEnvelope.context;
                const resolution = Viewport.pixelWidth + 'x' + Viewport.pixelHeight;
                handlerInput.responseBuilder.addDirective({
                    type: 'Alexa.Presentation.APL.RenderDocument',
                    version: '1.1',
                    document: constants.APL.launchDoc,
                    datasources: {
                        launchData: {
                            type: 'object',
                            properties: {
                                headerTitle: handlerInput.t('LAUNCH_HEADER_MSG'),
                                mainText: isBirthday ? sessionAttributes['age'] : handlerInput.t('DAYS_LEFT_MSG', {name: '', count: sessionAttributes['daysLeft']}),
                                hintString: handlerInput.t('LAUNCH_HINT_MSG'),
                                logoImage: isBirthday ? null : Viewport.pixelWidth > 480 ? util.getS3PreSignedUrl('ZeroToHero/full_icon_512.png') : util.getS3PreSignedUrl('ZeroToHero/full_icon_108.png'),
                                backgroundImage: isBirthday ? util.getS3PreSignedUrl('ZeroToHero/cake_'+resolution+'.png') : util.getS3PreSignedUrl('ZeroToHero/papers_'+resolution+'.png'),
                                backgroundOpacity: isBirthday ? "1" : "0.5"
                            },
                            transformers: [{
                                inputPath: 'hintString',
                                transformer: 'textToHint',
                            }]
                        }
                    }
                });
            }

            // Add home card to response
            // If you're using an Alexa Hosted Skill the images below will expire
            // and could not be shown in the card. You should replace them with static images
            handlerInput.responseBuilder.withStandardCard(
                handlerInput.t('LAUNCH_HEADER_MSG'),
                isBirthday ? sessionAttributes['age'] : handlerInput.t('DAYS_LEFT_MSG', {name: '', count: sessionAttributes['daysLeft']}),
                isBirthday ? util.getS3PreSignedUrl('ZeroToHero/cake_480x480.png') : util.getS3PreSignedUrl('ZeroToHero/papers_480x480.png'));
        } else {
            speechText += handlerInput.t('MISSING_MSG');
            // we use intent chaining to trigger the birthday registration multi-turn
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




const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
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
    RemindBirthdayIntentHandler,
    CelebrityBirthdaysIntentHandler,
    TouchIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    FallbackIntentHandler,
    SessionEndedRequestHandler,
    IntentReflectorHandler,
    ErrorHandler
}
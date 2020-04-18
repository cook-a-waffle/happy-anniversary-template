const Alexa = require('ask-sdk-core');
const i18n = require('i18next');
const languageStrings = require('./localisation');
const moment = require('moment-timezone');
const util = require('./util');
const constants = require('./constants');

////////////////////////////////////////////////////////////////////////////////////////////////////
// Request Handlers

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        const day = sessionAttributes['day'];
        const monthName = sessionAttributes['monthName'];
        const name = sessionAttributes['name'] || '';
        const sessionCounter = sessionAttributes['sessionCounter'];

        let speakOutput = !sessionCounter ? handlerInput.t('WELCOME_MSG', {name: name}) : handlerInput.t('WELCOME_BACK_MSG', {name: name});

        const dateAvailable = day && monthName;
        if (dateAvailable){
            speakOutput += handlerInput.t('AVAILABLE_MSG');
        } else {
            speakOutput += handlerInput.t('MISSING_MSG');
        }

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(handlerInput.t('REPROMPT_MSG'))
            .getResponse();
    }
};

const RegisterAnniversaryIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RegisterAnniversary';
    },
    handle(handlerInput) {

        const {attributesManager, requestEnvelope} = handlerInput;
        // the attributes manager allows us to access session attributes
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = requestEnvelope.request;

        if (intent.confirmationStatus === 'CONFIRMED') {
            const day = Alexa.getSlotValue(requestEnvelope, 'day');
            // we get the slot instead of the value directly as we also want to fetch the id
            const monthSlot = Alexa.getSlot(requestEnvelope, 'month');
            const monthName = monthSlot.value;
            const month = monthSlot.resolutions.resolutionsPerAuthority[0].values[0].value.id; //MM

            sessionAttributes['day'] = day;
            sessionAttributes['month'] = month; //MM
            sessionAttributes['monthName'] = monthName;
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
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'SayAnniversary';
    },
    handle(handlerInput) {
        const {attributesManager} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();

        const day = sessionAttributes['day'];
        const month = sessionAttributes['month']; //MM
        const monthName = sessionAttributes['monthName'];
        const name = sessionAttributes['name'] || '';
        let timezone = sessionAttributes['timezone'];
        let speakOutput = '';
        const dateAvailable = day && month;

        if (dateAvailable) {
            if (!timezone){
                timezone = 'Europe/Rome';  // so it works on the simulator, you should uncomment this line, replace with your time zone and comment sentence below
                //return handlerInput.responseBuilder
                //    .speak(handlerInput.t('NO_TIMEZONE_MSG'))
                //    .getResponse();
            }
            const annivData = getAnniversaryData (day, month, timezone);
            sessionAttributes['daysLeft'] = annivData.daysUntilAnniv;
            
            speakOutput += handlerInput.t('SAY_ANNIV_MSG', {day: day, monthName: monthName});

            if (annivData.daysUntilAnniv == 0){
                speakOutput += handlerInput.t('ANNIV_TODAY_MSG', {name: name});
            } else {
                speakOutput += handlerInput.t('DAYS_LEFT_MSG', {name: name, count: annivData.daysUntilAnniv});
            }
            
        } else {
            speakOutput += handlerInput.t('MISSING_MSG');
            // we use intent chaining to trigger the birthday registration multi-turn
            handlerInput.responseBuilder.addDelegateDirective({
                name: 'RegisterAnniversary',
                confirmationStatus: 'NONE',
                slots: {}
            });
        }
        // const speakOutput = handlerInput.t('SAY_ANNIV_MSG');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(handlerInput.t('REPROMPT_MSG'))
            .getResponse();
    }
};

////////////////////////////////////////////////////////////////////////////////////////////////////
// Helper Handlers

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

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = handlerInput.t('HELP_MSG');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
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

        const speakOutput = handlerInput.t('GOODBYE_MSG', {name: name});
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

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

////////////////////////////////////////////////////////////////////////////////////////////////////
// Request Interceptors

// This request interceptor will bind a translation function 't' to the handlerInput
// Additionally it will handle picking a random value if instead of a string it receives an array
const LocalisationRequestInterceptor = {
    process(handlerInput) {
        const localisationClient = i18n.init({
            lng: Alexa.getLocale(handlerInput.requestEnvelope),
            resources: languageStrings,
            returnObjects: true
        });
        localisationClient.localise = function localise() {
            const args = arguments;
            const value = i18n.t(...args);
            if (Array.isArray(value)) {
                return value[Math.floor(Math.random() * value.length)];
            }
            return value;
        };
        handlerInput.t = function translate(...args) {
            return localisationClient.localise(...args);
        }
    }
};

const LoadAttributesRequestInterceptor = {
    async process(handlerInput) {
        const {attributesManager, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        // the "loaded" check is because the "new" session flag is lost if there's a one shot utterance that hits an intent with auto-delegate
        if (Alexa.isNewSession(requestEnvelope) || !sessionAttributes['loaded']){ //is this a new session? not loaded from db?
            const persistentAttributes = await attributesManager.getPersistentAttributes() || {};
            console.log('Loading from persistent storage: ' + JSON.stringify(persistentAttributes));
            persistentAttributes['loaded'] = true;
            //copy persistent attribute to session attributes
            attributesManager.setSessionAttributes(persistentAttributes); // ALL persistent attributtes are now session attributes
        }
    }
};

// This request interceptor will log all incoming requests to this lambda
const LoggingRequestInterceptor = {
    process(handlerInput) {
        console.log(`Incoming request: ${JSON.stringify(handlerInput.requestEnvelope)}`);
    }
};

// If you disable the skill and reenable it the userId might change and the user will have to grant the permission to access the name again
const LoadNameRequestInterceptor = {
    async process(handlerInput) {
        const {attributesManager, serviceClientFactory, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        if (!sessionAttributes['name']){
            // let's try to get the given name via the Customer Profile API
            // don't forget to enable this permission in your skill configuratiuon (Build tab -> Permissions)
            // or you'll get a SessionEndedRequest with an ERROR of type INVALID_RESPONSE
            // Per our policies you can't make personal data persistent so we limit "name" to session attributes
            try {
                const {permissions} = requestEnvelope.context.System.user;
                if (!(permissions && permissions.consentToken))
                    throw { statusCode: 401, message: 'No permissions available' }; // there are zero permissions, no point in intializing the API
                const upsServiceClient = serviceClientFactory.getUpsServiceClient();
                const profileName = await upsServiceClient.getProfileGivenName();
                if (profileName) { // the user might not have set the name
                    //save to session attributes
                    sessionAttributes['name'] = profileName;
                }
            } catch (error) {
                console.log(JSON.stringify(error));
                if (error.statusCode === 401 || error.statusCode === 403) {
                    // the user needs to enable the permissions for given name, let's append a permissions card to the response.
                    handlerInput.responseBuilder.withAskForPermissionsConsentCard(constants.GIVEN_NAME_PERMISSION);
                }
            }
        }
    }
};

const LoadTimezoneRequestInterceptor = {
    async process(handlerInput) {
        const {attributesManager, serviceClientFactory, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const deviceId = Alexa.getDeviceId(requestEnvelope);

        if (!sessionAttributes['timezone']){
            // let's try to get the timezone via the UPS API
            // (no permissions required but it might not be set up)
            try {
                const upsServiceClient = serviceClientFactory.getUpsServiceClient();
                const timezone = await upsServiceClient.getSystemTimeZone(deviceId);
                if (timezone) { // the user might not have set the timezone yet
                    console.log('Got timezone from device: ' + timezone);
                    //save to session and persisten attributes
                    sessionAttributes['timezone'] = timezone;
                }
            } catch (error) {
                console.log(JSON.stringify(error));
            }
        }
    }
};

////////////////////////////////////////////////////////////////////////////////////////////////////
// Response Interceptors

// This response interceptor will log all outgoing responses of this lambda
const LoggingResponseInterceptor = {
    process(handlerInput, response) {
        console.log(`Outgoing response: ${JSON.stringify(response)}`);
    }
};

// If you disable the skill and reenable it the userId might change and you loose the persistent attributes saved below as userId is the primary key
const SaveAttributesResponseInterceptor = {
    async process(handlerInput, response) {
        if (!response) return; // avoid intercepting calls that have no outgoing response due to errors
        const {attributesManager, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const shouldEndSession = (typeof response.shouldEndSession === "undefined" ? true : response.shouldEndSession); //is this a session end?
        // the "loaded" check is because the session "new" flag is lost if there's a one shot utterance that hits an intent with auto-delegate
        const loadedThisSession = sessionAttributes['loaded'];
        if ((shouldEndSession || Alexa.getRequestType(requestEnvelope) === 'SessionEndedRequest') && loadedThisSession) { // skill was stopped or timed out
            // we increment a persistent session counter here
            sessionAttributes['sessionCounter'] = sessionAttributes['sessionCounter'] ? sessionAttributes['sessionCounter'] + 1 : 1;
            // limiting save of session attributes to the ones we want to make persistent
            for (var key in sessionAttributes) {
                if (!constants.PERSISTENT_ATTRIBUTES_NAMES.includes(key))
                    delete sessionAttributes[key];
            }
            console.log('Saving to persistent storage:' + JSON.stringify(sessionAttributes));
            attributesManager.setPersistentAttributes(sessionAttributes);
            await attributesManager.savePersistentAttributes();
        }
    }
};

////////////////////////////////////////////////////////////////////////////////////////////////////
// Logic Functions

function getAnniversaryData (day, month, timezone) {
    const today = moment().tz(timezone).startOf('day');
    const nextAnniv = moment(`${month}/${day}/${today.year()}`, "MM/DD/YYYY").tz(timezone).startOf('day');
    if (today.isAfter(nextAnniv)) {
        nextAnniv.add(1, 'years');
    }
    const daysUntilAnniv = nextAnniv.startOf('day').diff(today, 'days'); // same day returns 0

    return {
        today: today,
        nextAnniv: nextAnniv, // not used but nice to have :)
        daysUntilAnniv: daysUntilAnniv,
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Lambda Handler Function

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        RegisterAnniversaryIntentHandler,
        SayAnniversaryIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler, // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
        ) 
    .addErrorHandlers(
        ErrorHandler,
        )
    .addRequestInterceptors(
        LoadAttributesRequestInterceptor,
        LocalisationRequestInterceptor,
        LoggingRequestInterceptor,
        LoadNameRequestInterceptor,
        LoadTimezoneRequestInterceptor)
    .addResponseInterceptors(
        LoggingResponseInterceptor,
        SaveAttributesResponseInterceptor)
    .withApiClient(new Alexa.DefaultApiClient())
    .withPersistenceAdapter(util.getPersistenceAdapter())
    .lambda();

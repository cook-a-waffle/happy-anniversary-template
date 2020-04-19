const moment = require('moment-timezone'); // will help us do all the dates math while considering the timezone
const util = require('./util');
const axios = require('axios');

module.exports = {
    getBirthdayData(day, month, year, timezone) {
        const today = moment().tz(timezone).startOf('day');
        const wasBorn = moment(`${month}/${day}/${year}`, "MM/DD/YYYY").tz(timezone).startOf('day');
        const nextBirthday = moment(`${month}/${day}/${today.year()}`, "MM/DD/YYYY").tz(timezone).startOf('day');
        if (today.isAfter(nextBirthday)) {
            nextBirthday.add(1, 'years');
        }
        const age = today.diff(wasBorn, 'years');
        const daysAlive = today.diff(wasBorn, 'days');
        const daysUntilBirthday = nextBirthday.startOf('day').diff(today, 'days'); // same day returns 0

        return {
            daysAlive: daysAlive, // not used but nice to have :)
            daysUntilBirthday: daysUntilBirthday,
            age: age //in years
        }
    },
    createBirthdayReminder(daysUntilBirthday, timezone, locale, message) {
        moment.locale(locale);
        const createdMoment = moment().tz(timezone);
        let triggerMoment = createdMoment.startOf('day').add(daysUntilBirthday, 'days');
        if (daysUntilBirthday === 0) {
            triggerMoment = createdMoment.startOf('day').add(1, 'years'); // reminder created on the day of birthday will trigger next year
        }
        console.log('Reminder schedule: ' + triggerMoment.format('YYYY-MM-DDTHH:mm:00.000'));

        return util.createReminder(createdMoment, triggerMoment, timezone, locale, message);
    },
    getAdjustedDate(timezone) {
        const today = moment().tz(timezone).startOf('day');

        return {
            day: today.date(),
            month: today.month() + 1
        }
    },
    convertBirthdaysResponse(handlerInput, response, withAge, timezone){
        let speechResponse = '';
        // if the API call failed we just don't append today's birthdays to the response
        if (!response || !response.results || !response.results.bindings || !Object.keys(response.results.bindings).length > 0)
            return speechResponse;
        const results = response.results.bindings;
        speechResponse += handlerInput.t('ALSO_TODAY_MSG');
        results.forEach((person, index) => {
            console.log(person);
            speechResponse += person.humanLabel.value;
            if (withAge && timezone && person.date_of_birth.value) {
                const age = module.exports.convertBirthdateToYearsOld(person, timezone);
                speechResponse += handlerInput.t('TURNING_YO_MSG', {count: age});
                person.date_of_birth.value = handlerInput.t('LIST_YO_ABBREV_MSG', {count: age});
            }
            if (index === Object.keys(results).length - 2)
                speechResponse += handlerInput.t('CONJUNCTION_MSG');
            else
                speechResponse += '. ';
        });

        return speechResponse;
    },
    convertBirthdateToYearsOld(person, timezone) {
        const today = moment().tz(timezone).startOf('day');
        const wasBorn = moment(person.date_of_birth.value).tz(timezone).startOf('day');
        return today.diff(wasBorn, 'years');
    }
}
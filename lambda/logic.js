const moment = require('moment-timezone'); // will help us do all the dates math while considering the timezone
const util = require('./util');

module.exports = {
    getAnnivData(day, month, timezone) {
        const today = moment().tz(timezone).startOf('day');
        const nextAnniv = moment(`${month}/${day}/${today.year()}`, "MM/DD/YYYY").tz(timezone).startOf('day');
        if (today.isAfter(nextAnniv)) {
            nextAnniv.add(1, 'years');
        }
        return {
            today: today,
            nextAnniv: nextAnniv,
            daysUntilAnniv: nextAnniv.startOf('day').diff(today, 'days')
        }
    },
    createAnnivReminder(daysUntilAnniv, timezone, locale, message) {
        moment.locale(locale);
        const createdMoment = moment().tz(timezone);
        let triggerMoment = createdMoment.startOf('day').add(daysUntilAnniv, 'days');
        if (daysUntilAnniv === 0) {
            triggerMoment = createdMoment.startOf('day').add(1, 'years'); // reminder created on the day of Anniv will trigger next year
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
    convertBirthdateToYearsOld(person, timezone) {
        const today = moment().tz(timezone).startOf('day');
        const wasBorn = moment(person.date_of_birth.value).tz(timezone).startOf('day');
        return today.diff(wasBorn, 'years');
    }
}
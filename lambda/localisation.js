module.exports = {
    en: {
        translation: {
            POSITIVE_SOUND: `<audio src='soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_positive_response_02'/>`,
            GREETING_SPEECHCON: `<say-as interpret-as="interjection">Congratulations</say-as>`,
            DOUBT_SPEECHCON: `<say-as interpret-as="interjection">hmm</say-as>`,
            WELCOME_MSG: `Welcome to Happy Anniversary {{name}}.`,
            WELCOME_BACK_MSG: 'Welcome back {{name}}! ',
            REJECTED_MSG: 'No problem. Please say the date again so I can get it right.',
            DAYS_LEFT_MSG: `{{name}} There's {{count}} day left until your anniversary, on {{monthName}} {{day}}. `,
            DAYS_LEFT_MSG_plural: '{{name}} There are {{count}} days left until your anniversary, on {{monthName}} {{day}}. ',
            GREET_MSG: '$t(POSITIVE_SOUND) $t(GREETING_SPEECHCON) {{name}}! Today is your anniversary!',
            MISSING_MSG: `$t(DOUBT_SPEECHCON). It looks like you haven't told me your anniversary yet. `,
            POST_SAY_HELP_MSG: `If you want to change the date, try saying, register my anniversary. Or I can tell you a Fun Fact. What would you like to do next? `,
            POST_SAY_HELP_MSG_wd: `If you want to change the date, try saying, register my anniversary. Or I can tell you a Fun Fact. Finally, I can show you a picture of you guys. What would you like to do next? `,
            FUN_FACT_INTRO_MSG:`Ok, did you know that. `,
            FUN_FACT_MSG_lst:[`Her favorite food are quesadillas. `, `Your favorite activity to do together is to go to concerts. `, `His favorite color is blue. `, `You guys met 3 years ago during the cervantine festival. `],
            POST_ACTIVITY_MSG: `<break time="1s"/> You can select another option, or exit the skill. What would you like to do next? `,
            SHOW_PIC_MSG: `You look great in this picture, `,
            NO_DISPLAY_MSG: `Sorry, This device can't show pictures`,
            HELP_MSG: 'I can remember your anniversary if you tell me the date. I can also tell you the remaining days until your next anniversary. Or I can tell you a fun fact. Which one would you like to try? ',
            HELP_MSG_wd: 'I can remember your anniversary if you tell me the date. I can also tell you the remaining days until your next anniversary. Or I can tell you a fun fact. Finally, I can show you a picture of you guys. Which one would you like to try? ',
            REPROMPT_MSG: `If you're not sure what to do next try asking for help. If you want to leave just say stop. What would you like to do next? `,
            GOODBYE_MSG: ['Goodbye {{name}}! ', 'So long {{name}}! ', 'See you later {{name}}! ', 'Cheers {{name}}! '],
            REFLECTOR_MSG: 'You just triggered {{intent}}',
            FALLBACK_MSG: `Sorry, I don't know about that. Please try again.`,
            ERROR_MSG: 'Oops, there was an error. Please try again.',
            NO_TIMEZONE_MSG: `I can't determine your timezone. Please check your device settings and make sure a timezone was selected. After that please reopen the skill and try again!`,
            CONJUNCTION_MSG: ' and '
        }
    }
}
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
            FUN_FACT_INTRO_MSG:`Ok, did you know that. `,
            FUN_FACT_MSG_lst:[`Her favorite food are quesadillas. `, `Your favorite activity to do together is to go to concerts. `, `His favorite color is blue. `, `You guys met 3 years ago during the cervantine festival. `],
            SHOW_PIC_MSG: `You look great in this picture, `,
            NO_DISPLAY_MSG: `Sorry, This device can't show pictures`,
            HELP_MSG: 'I can remember your anniversary if you tell me the date. I can also tell you the remaining days until your next anniversary. Or I can tell you a fun fact. Which one would you like to try? ',
            REPROMPT_MSG: `If you're not sure what to do next try asking for help. If you want to leave just say stop. What would you like to do next? `,
            GOODBYE_MSG: ['Goodbye {{name}}! ', 'So long {{name}}! ', 'See you later {{name}}! ', 'Cheers {{name}}! '],
            REFLECTOR_MSG: 'You just triggered {{intent}}',
            FALLBACK_MSG: `Sorry, I don't know about that. Please try again.`,
            ERROR_MSG: 'Oops, there was an error. Please try again.',
            NO_TIMEZONE_MSG: `I can't determine your timezone. Please check your device settings and make sure a timezone was selected. After that please reopen the skill and try again!`,
            CONJUNCTION_MSG: ' and '
        }
    },
    es: {
        translation: {
            POSITIVE_SOUND: `<audio src='soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_positive_response_02'/>`,
            GREETING_SPEECHCON: `<say-as interpret-as="interjection">felicidades</say-as>`,
            DOUBT_SPEECHCON: `<say-as interpret-as="interjection">hmm</say-as>`,
            WELCOME_MSG: 'Te doy la bienvenida a Feliz Aniversario {{name}}! ',
            WELCOME_BACK_MSG: 'Te doy la bienvenida otra vez {{name}}! ',
            REJECTED_MSG: 'No pasa nada. Por favor dime la fecha otra vez y lo corregimos. ',
            DAYS_LEFT_MSG: '{{name}} Queda {{count}} día para tu aniversario',
            DAYS_LEFT_MSG_plural: '{{name}} Quedan {{count}} días para tu aniversario',
            GREET_MSG: '$t(POSITIVE_SOUND) $t(GREETING_SPEECHCON) {{name}}! Tu aniversario es Hoy!',
            MISSING_MSG: '$t(DOUBT_SPEECHCON). Parece que aun no me has dicho tu fecha de aniversario. ',
            POST_SAY_HELP_MSG: `Si quieres cambiar la fecha puedes decir, registra mi aniversario. Tambien puedo darte un dato curioso. Qué quieres hacer? `,
            FUN_FACT_INTRO_MSG:`Va! sabias que. `,
            FUN_FACT_MSG_lst:[`A ella le gustan los pambazos. `, `Su actividad favorita para hacer juntos, es ir a conciertos. `, `El color favorito de el, es el azul. `, `Se conocieron hace 3 años en el festival cervantino. `],
            SHOW_PIC_MSG: `Se ven genial en esta foto, `,
            NO_DISPLAY_MSG: `Lo lamento, este dispositivo no puede realizar mostrar imagenes. `,
            HELP_MSG: 'Puedo recordar tu aniversario si me dices una fecha. Decirte cuanto falta para que cumplas. O darte un dato curioso. Qué quieres hacer? ',
            REPROMPT_MSG: 'Si no sabes como continuar intent pedir ayuda. Si quieres salir solo dí para. Qué quieres hacer? ',
            GOODBYE_MSG: ['Hasta luego {{name}}! ', 'Adios {{name}}! ', 'Hasta pronto {{name}}! ', 'Nos vemos {{name}}! '],
            REFLECTOR_MSG: 'Acabas de activar {{intent}}',
            FALLBACK_MSG: 'Lo siento, no se nada sobre eso. Por favor inténtalo otra vez. ',
            ERROR_MSG: 'Lo siento, ha habido un problema. Por favor inténtalo otra vez. ',
            NO_TIMEZONE_MSG: 'No he podido determinar tu zona horaria. Verifica la configuración de tu dispositivo, abre otraa vez la skill e inténtalo otra vez.',
            CONJUNCTION_MSG: ' y '
        }
    }
}
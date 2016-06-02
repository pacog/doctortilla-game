'use strict';
var Conversation = require('../engine/models/Conversation.js');
var ConversationLine = require('../engine/models/ConversationLine.js');

function sayProblemsIntro(player, band) {
    return band.say('ANGEL: No es por alarmar pero está habiendo algunos contratiempos...')
                .then(() => {
                    return band.say('SANTI: ...minucias sin importancia...');
                })
                .then(() => {
                    return band.say('JUAN: ...impedimentos BRUTALES.');
                });
}

function sayListOfProblems(player, band) {
    player.changeAttr('TALKED_TO_BAND_ABOUT_PROBLEMS', true);
    return band.say('ANGEL: Resulta que aquí el amigo Juan se ha olvidado su disfraz...')
                .then(() => {
                    return band.say('JUAN: Un disfraz BRUTAL, de cowboy vintage, siglo XIV, con espuelas de...');
                })
                .then(() => {
                    return band.say('ANGEL: Sí, sí... pero lo ha dejado en el local de ensayo, así que hay que buscarle otro.');
                })
                .then(() => {
                    return band.say('JUAN: Y tu te has olvidado el cable de corriente, así que si quieres que se oiga algo...');
                })
                .then(() => {
                    return band.say('ANGEL: Me tendrás que conseguir uno.');
                })
                .then(() => {
                    return band.say('ANGEL: Y luego está el problema con Santi.');
                })
                .then(() => {
                    return band.say('JUAN: El pobre está tímido y no se atrever a salir.');
                })
                .then(() => {
                    return band.say('ANGEL: Dice que no ensayamos nunca y se siente inseguro.');
                })
                .then(() => {
                    return band.say('JUAN: Ya sabes cómo son los zurdos con estas cosas...');
                });
}

function sayBiliSituation(player, band) {
    return band.say('ANGEL: Está fuera fumando, pero como lo dejemos mucho tiempo se va a poner como las grecas.');
}

const script = {
    'initial': [
        new ConversationLine('¡Doctortillas! ¿Listos para tocar?', 'LIST_OF_PROBLEMS', sayProblemsIntro),
        //TODO line like above but aggressive
        new ConversationLine('¿Habéis visto a Bili?', 'initial', sayBiliSituation),
        new ConversationLine('¡Hasta luego!', 'end')
    ],
    'LIST_OF_PROBLEMS': [
        new ConversationLine('¿Impedimentos? Contadme más, queridos amiguitos.',
                             'INITIAL_AFTER_FIRST_TALK', sayListOfProblems),
        new ConversationLine('¿Problemas? ¿Impedimentos? No contéis conmigo...',
                             'INITIAL_AFTER_FIRST_TALK', sayListOfProblems)
    ],
    'INITIAL_AFTER_FIRST_TALK': [
        new ConversationLine('¿Cómo está Bili?', 'INITIAL_AFTER_FIRST_TALK', sayBiliSituation),
        new ConversationLine('Mmmm, voy a ver si arreglamos este follón', 'end')
    ]
};

class ConversationWithBand extends Conversation {
    _initState() {
        if (this.player.getAttr('TALKED_TO_BAND_ABOUT_PROBLEMS')) {
            this.state = 'INITIAL_AFTER_FIRST_TALK';
        } else {
            this.state = 'initial';
        }
    }

    _loadScript() {
        this.script = script;
    }

}

module.exports = ConversationWithBand;
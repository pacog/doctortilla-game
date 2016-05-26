var Conversation = require('../engine/models/Conversation.js');
var ConversationLine = require('../engine/models/ConversationLine.js');

const script = {
    'initial': [
        new ConversationLine(
            () => {
                return 'Que dise el tio?';
            },
            'initial',
            (player, bili) => {
                return bili.say('Pues aquí estamos');
            }
        ),
        new ConversationLine('Adiós!', 'end')
    ]
};

class ConversationWithBili extends Conversation {
    _initState() {
        this.state = 'initial';
    }

    _loadScript() {
        this.script = script;
    }

}

module.exports = ConversationWithBili;
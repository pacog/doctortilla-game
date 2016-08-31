import { Conversation, IConversationScript } from '../../engine/models/Conversation';
import { ConversationLine } from '../../engine/models/ConversationLine';
import { Player } from '../../engine/models/Player';
import { Thing } from '../../engine/models/Thing';
import { DoctortillaPlayer } from '../DoctortillaPlayer';
import { BandInSofa } from './BandInSofa';

const script: IConversationScript = {
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
    ],
    'WE_ARE_READY': [
        new ConversationLine('¡Todo listo! Voy a por Bili y empezamos', 'end')
    ]
};

export class ConversationWithBand extends Conversation {


    constructor(protected player: DoctortillaPlayer, protected otherPerson: Thing) {
        super(player, otherPerson);
    }

    protected initState(): void {
        if (this.player.getAttr('TALKED_TO_BAND_ABOUT_PROBLEMS')) {
            this.state = this.getStateIfPlayerDeliveredEverything();
        } else {
            this.state = 'initial';
        }
    }

    protected loadScript(): void {
        this.script = Object.assign({}, script);
        let dialogPart: Array<ConversationLine> = [];
        dialogPart = this.script['INITIAL_AFTER_FIRST_TALK'].concat(dialogPart);

        this.loadExtraOptionsInInitialFirstTalk(dialogPart);
        this.script['INITIAL_AFTER_FIRST_TALK'] = dialogPart;
    }

    private loadExtraOptionsInInitialFirstTalk(dialogPart: Array<ConversationLine>) {
        this.addCostumeLine(dialogPart);
        this.addCableLine(dialogPart);
        this.addDrinkLine(dialogPart);
    }

    private addCostumeLine(dialogPart: Array<ConversationLine>): void {
        if (this.player.hasCompleteCostume()) {
            dialogPart.unshift(new ConversationLine(
                'Tengo el disfraz',
                () => { return this.getStateIfPlayerDeliveredEverything(); },
                sayCostumeIsOk
            ));
        }
    }

    private addCableLine(dialogPart: Array<ConversationLine>): void {
        if (this.player.hasCable()) {
            dialogPart.unshift(new ConversationLine(
                'Tengo el cable',
                () => { return this.getStateIfPlayerDeliveredEverything(); },
                sayCableIsOk
            ));
        }
    }

    private addDrinkLine(dialogPart: Array<ConversationLine>): void {
        if (this.player.hasFunnyDrink()) {
            dialogPart.unshift(new ConversationLine(
                'Santi te he traido un refrigerio',
                () => { return this.getStateIfPlayerDeliveredEverything(); },
                sayDrinkIsOk
            ));
        }
    }

    private getStateIfPlayerDeliveredEverything(): string {
        if (this.player.deliveredEverything()) {
            return 'WE_ARE_READY';
        } else {
            return 'INITIAL_AFTER_FIRST_TALK';
        }
    }

}

function sayProblemsIntro(player: DoctortillaPlayer, band: BandInSofa): Promise<any> {
    return band.say('No es por alarmar pero está habiendo algunos contratiempos...', 'angel')
                .then(() => {
                    return band.say('...minucias sin importancia...', 'santi');
                })
                .then(() => {
                    return band.say('...impedimentos BRUTALES.', 'juan');
                });
}

function sayListOfProblems(player: DoctortillaPlayer, band: BandInSofa): Promise<any> {
    player.changeAttr('TALKED_TO_BAND_ABOUT_PROBLEMS', true);
    return band.say('Resulta que aquí el amigo Juan se ha olvidado su disfraz...', 'angel')
                .then(() => {
                    return band.say('Un disfraz BRUTAL, de cowboy vintage, siglo XIV, con espuelas de...', 'juan');
                })
                .then(() => {
                    return band.say('Sí, sí... pero lo ha dejado en el local de ensayo, así que hay que buscarle otro.', 'angel');
                })
                .then(() => {
                    return band.say('Y tu te has olvidado el cable de corriente, así que si quieres que se oiga algo...', 'juan');
                })
                .then(() => {
                    return band.say('Me tendrás que conseguir uno.', 'angel');
                })
                .then(() => {
                    return band.say('Y luego está el problema con Santi.', 'angel');
                })
                .then(() => {
                    return band.say('El pobre está tímido y no se atrever a salir.', 'juan');
                })
                .then(() => {
                    return band.say('Dice que no ensayamos nunca y se siente inseguro.', 'angel');
                })
                .then(() => {
                    return band.say('Ya sabes cómo son los zurdos con estas cosas...', 'juan');
                });
}

function sayBiliSituation(player: DoctortillaPlayer, band: BandInSofa): Promise<any> {
    return band.say('Está fuera fumando, pero como lo dejemos mucho tiempo se va a poner como las grecas.', 'angel');
}

function sayCostumeIsOk(player: DoctortillaPlayer, band: BandInSofa): Promise<any> {
    return band.say('Vaya disfraz ridículo.', 'juan')
                .then(() => {
                    return band.say('El mío era mejor', 'juan');
                })
                .then(() => {
                    return player.say('Te lo pones, o te lo pongo.');
                })
                .then(() => {
                    band.changeAttr('HAS_COSTUME', true);
                    player.changeAttr('DELIVERED_COSTUME', true);
                    player.removeCostume();
                    return player.say('Me lo pongo.');
                });
}


function sayCableIsOk(player: DoctortillaPlayer, band: BandInSofa): Promise<any> {
    return band.say('No voy a preguntar de dónde lo has sacado...', 'angel')
                .then(() => {
                    return band.say('Lo has robado, ¿verdad?', 'santi');
                })
                .then(() => {
                    band.changeAttr('HAS_CABLE', true);
                    player.changeAttr('DELIVERED_CABLE', true);
                    player.removeCable();
                    return player.say('Digamos que tengo recursos.');
                });
}

function sayDrinkIsOk(player: DoctortillaPlayer, band: BandInSofa): Promise<any> {
    return band.say('Mmm un refrescante refresco...', 'santi')
                .then(() => {
                    return band.say('Glu glu glu', 'santi');
                })
                .then(() => {
                    return band.say('...', 'santi');
                })
                .then(() => {
                    return band.say('(eructo)', 'santi');
                })
                .then(() => {
                    return band.say('No sabía a droga ni nada', 'santi');
                })
                .then(() => {
                    return band.say('Estoy empezando a sentirme listo para tocar', 'santi');
                })
                .then(() => {
                    band.changeAttr('HAS_DRINK', true);
                    player.changeAttr('DELIVERED_DRINK', true);
                    player.removeGlass();
                    return player.say('Así me gusta.');
                });
}

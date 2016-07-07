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

    private doctortillaPlayer: DoctortillaPlayer;

    constructor(protected player: Player, protected otherPerson: Thing) {
        super(player, otherPerson);
        this.doctortillaPlayer = <DoctortillaPlayer> this.player;
    }

    protected initState(): void {
        if (this.doctortillaPlayer.getAttr('TALKED_TO_BAND_ABOUT_PROBLEMS')) {
            this.state = this.getStateIfPlayerDeliveredEverything();
        } else {
            this.state = 'initial';
        }
    }

    protected loadScript(): void {
        this.script = script
        let dialogPart: Array<ConversationLine> = [];
        dialogPart.push(...this.script['INITIAL_AFTER_FIRST_TALK']);

        this.loadExtraOptionsInInitialFirstTalk(dialogPart);
        this.script['INITIAL_AFTER_FIRST_TALK'] = dialogPart;
    }

    private loadExtraOptionsInInitialFirstTalk(dialogPart: Array<ConversationLine>) {
        this.addCostumeLine(dialogPart);
        this.addCableLine(dialogPart);
        this.addDrinkLine(dialogPart);
    }

    private addCostumeLine(dialogPart: Array<ConversationLine>): void {
        if (this.doctortillaPlayer.hasCompleteCostume()) {
            dialogPart.unshift(new ConversationLine(
                'Tengo el disfraz',
                () => { return this.getStateIfPlayerDeliveredEverything(); },
                sayCostumeIsOk
            ));
        }
    }

    private addCableLine(dialogPart: Array<ConversationLine>): void {
        if (this.doctortillaPlayer.hasCable()) {
            dialogPart.unshift(new ConversationLine(
                'Tengo el cable',
                () => { return this.getStateIfPlayerDeliveredEverything(); },
                sayCableIsOk
            ));
        }
    }

    private addDrinkLine(dialogPart: Array<ConversationLine>): void {
        if (this.doctortillaPlayer.hasFunnyDrink()) {
            dialogPart.unshift(new ConversationLine(
                'Santi te he traido un refrigerio',
                () => { return this.getStateIfPlayerDeliveredEverything(); },
                sayDrinkIsOk
            ));
        }
    }

    private getStateIfPlayerDeliveredEverything(): string {
        if (this.doctortillaPlayer.deliveredEverything()) {
            return 'WE_ARE_READY';
        } else {
            return 'INITIAL_AFTER_FIRST_TALK';
        }
    }

}

function sayProblemsIntro(player: DoctortillaPlayer, band: BandInSofa): Promise<any> {
    return band.say('ANGEL: No es por alarmar pero está habiendo algunos contratiempos...')
                .then(() => {
                    return band.say('SANTI: ...minucias sin importancia...');
                })
                .then(() => {
                    return band.say('JUAN: ...impedimentos BRUTALES.');
                });
}

function sayListOfProblems(player: DoctortillaPlayer, band: BandInSofa): Promise<any> {
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

function sayBiliSituation(player: DoctortillaPlayer, band: BandInSofa): Promise<any> {
    return band.say('ANGEL: Está fuera fumando, pero como lo dejemos mucho tiempo se va a poner como las grecas.');
}

function sayCostumeIsOk(player: DoctortillaPlayer, band: BandInSofa): Promise<any> {
    return band.say('JUAN: Vaya disfraz ridículo.')
                .then(() => {
                    return band.say('JUAN: El mío era mejor');
                })
                .then(() => {
                    return player.say('Te lo pones, o te lo pongo.');
                })
                .then(() => {
                    band.changeAttr('HAS_COSTUME', true);
                    player.changeAttr('DELIVERED_COSTUME', true);
                    player.removeCostume();
                    return player.say('JUAN: Me lo pongo.');
                });
}


function sayCableIsOk(player: DoctortillaPlayer, band: BandInSofa): Promise<any> {
    return band.say('ANGEL: No voy a preguntar de dónde lo has sacado...')
                .then(() => {
                    return band.say('SANTI: Lo has robado, ¿verdad?');
                })
                .then(() => {
                    band.changeAttr('HAS_CABLE', true);
                    player.changeAttr('DELIVERED_CABLE', true);
                    player.removeCable();
                    return player.say('Digamos que tengo recursos.');
                });
}

function sayDrinkIsOk(player: DoctortillaPlayer, band: BandInSofa): Promise<any> {
    return band.say('SANTI: Mmm un refrescante refresco...')
                .then(() => {
                    return band.say('SANTI: Glu glu glu');
                })
                .then(() => {
                    return band.say('SANTI: ...');
                })
                .then(() => {
                    return band.say('SANTI: (eructo)');
                })
                .then(() => {
                    return band.say('SANTI: No sabía a droga ni nada');
                })
                .then(() => {
                    return band.say('SANTI: Estoy empezando a sentirme listo para tocar');
                })
                .then(() => {
                    band.changeAttr('HAS_DRINK', true);
                    player.changeAttr('DELIVERED_DRINK', true);
                    player.removeGlass();
                    return player.say('Así me gusta.');
                });
}

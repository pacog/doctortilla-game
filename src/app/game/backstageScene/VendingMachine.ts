import { Thing } from '../../engine/models/Thing';
import { Player } from '../../engine/models/Player';
import { selectedThing } from '../../engine/state/SelectedObjects';
import { SpeechBubble } from '../../engine/ui/SpeechBubble';
import { Can } from './Can';
import { uiBlocker } from '../../engine/ui/UIBlocker.singleton';
import { Directions } from '../../engine/utils/Directions';
import { randomText } from '../../engine/utils/RandomText';

const NORMAL_FRAME = 0;
const GREASED_FRAME = 1;
const GREASED_AND_PUSHED_FRAME = 2;

export class VendingMachine extends Thing {

    private speechBubble: SpeechBubble;

    constructor() {
        let options = {
            id: 'vending',
            x: 155,
            y: 98,
            spriteId: 'VENDING_MACHINE_SPRITE',
            name: 'VENDING_MACHINE',
            goToPosition: {
                x: 167,
                y: 178
            },
            directionToLook: Directions.UP
        };
        super(options);
        this.speechBubble = new SpeechBubble({
            owner: this,
            foregroundTextStyle: 'FONT_32_BLACK',
            shadowTextStyle: 'FONT_32_PURPLE'
        });
    }

    protected pushAction(player: Player): Promise<void> {
        if (this.getAttr('PUSHED')) {
            return player.say('I_ALREADY_PUSHED_IT');
        } else if (this.getAttr('GREASED')) {
            return player.goToThing(this)
                .then(() => {
                    player.say('ARGH');
                    this.changeAttr('PUSHED', true);
                });
        } else {
            return player.goToThing(this)
                .then(() => {
                    return player.say('THE_FLOOR_IS_STICKY');
                })
                .then(() => {
                    return player.say('IF_I_COULD_PUT_GREASE_BELOW');
                });
        }
    }

    protected useAction(player: Player): void {
        if (selectedThing.thing.id === 'bacon') {
            this.greaseWithBacon(player);
        } else if (selectedThing.thing.id === 'coin') {
            this.getCan(player, selectedThing.thing);
        } else {
            player.say('I_DONT_KNOW_HOW_TO_USE_THAT_WITH_VENDING_MACHINE');
        }
    }

    private say(text: string): Promise<void> {
        return this.speechBubble.say(text);
    }

    private greaseWithBacon(player: Player): void {
        player.goToThing(this)
            .then(() => {
                this.changeAttr('GREASED', true);
                player.say('NICE_IT_WILL_SLIDE_REALLY_WELL_NOW');
            });
    }

    private getCan(player: Player, coin: Thing): void {
        uiBlocker.block();
        player.goToThing(this)
            .then(() => {
                coin.destroy();
                return this.say('CLONK');
            })
            .then(() => {
                new Can();
                player.say('WISE_PURCHASE');
                uiBlocker.unblock();
            });
    }

    protected onStateChange(): void {
        if (!this.sprite) {
            return null;
        }
        if (this.getAttr('GREASED')) {
            if (this.getAttr('PUSHED')) {
                this.sprite.frame = GREASED_AND_PUSHED_FRAME;
            } else {
                this.sprite.frame = GREASED_FRAME;
            }
        } else {
            this.sprite.frame = NORMAL_FRAME;
        }
    }
}
import { Thing } from '../../engine/models/Thing';
import { Player } from '../../engine/models/Player';
import { selectedThing } from '../../engine/state/SelectedObjects';
import { SpeechBubble } from '../../engine/ui/SpeechBubble';

const NORMAL_FRAME = 0;
const GREASED_FRAME = 1;
const GREASED_AND_PUSHED_FRAME = 2;

export class VendingMachine extends Thing {

    private speechBubble: SpeechBubble;

    constructor() {
        let options = {
            id: 'vending',
            x: 54,
            y: 131,
            spriteId: 'VENDING_SPRITE',
            name: 'vending machine',
            goToPosition: {
                x: 80,
                y: 185
            }
        };
        super(options);
        this.speechBubble = new SpeechBubble({
            owner: this
        });
    }

    protected pushAction(player: Player): Promise<void> {
        if (this.getAttr('PUSHED')) {
            return player.say('I already pushed too much');
        } else if (this.getAttr('GREASED')) {
            return player.goToThing(this)
                .then(() => {
                    player.say('Aaaaaragahgahghghghghg');
                    this.changeAttr('PUSHED', true);
                });
        } else {
            return player.goToThing(this)
                .then(() => {
                    return player.say('The floor is so sticky it is impossible to move it.');
                })
                .then(() => {
                    return player.say('If I could just put some grease below it...');
                });
        }
    }

    protected useAction(player: Player): void {
        if (selectedThing.thing.id === 'bacon') {
            this.greaseWithBacon(player);
        } else if (selectedThing.thing.id === 'coin') {
            this.getCan(player, selectedThing.thing);
        } else {
            player.say('I don\t know how to use that with a vending machine...');
        }
    }

    private say(text: string): Promise<void> {
        return this.speechBubble.say(text);
    }

    private greaseWithBacon(player: Player): void {
        player.goToThing(this)
            .then(() => {
                this.changeAttr('GREASED', true);
                player.say('Nice, it will slide really well now...');
            });
    }

    private getCan(player: Player, coin: Thing): void {
        //TODO
        // uiBlocker.block();
        player.goToThing(this)
            .then(() => {
                coin.destroy();
                this.say('Clonk\n   clonk\n      clonk');
            })
            .then(() => {
                //TODO
                // new Can();
                player.say('That was a wise purchase');
                //TODO
                // uiBlocker.unblock();
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
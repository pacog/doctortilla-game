import { Thing } from '../../engine/models/Thing';
import { DoctortillaPlayer } from '../DoctortillaPlayer';
import { Directions } from '../../engine/utils/Directions';

let options = {
    id: 'tap',
    x: 390,
    y: 142,
    spriteId: 'TAP_SPRITE',
    name: 'TAP',
    directionToLook: Directions.UP
};

export class Tap extends Thing {
    constructor() {
        super(options);
    }

    protected lookAction(player: DoctortillaPlayer) { 
       player.say('REGULAR_TAP'); 
    }

    openAction(player: DoctortillaPlayer): void  {
        player.goToThing(this)
            .then(() => this.open(player));
    }

    closeAction(player: DoctortillaPlayer): void  {
        player.goToThing(this)
            .then(() => this.close(player));
    }
    
    private open(player: DoctortillaPlayer): void {
        if (this.getAttr('OPEN')) {
            player.say('It is already open!');
        } else {
            this.changeAttr('OPEN', true);
            player.say('SAVE_WATER')
        }
    }

    private close(player: DoctortillaPlayer): void {
        if (!this.getAttr('OPEN')) {
            player.say('It is already closed!');
        } else {
            this.changeAttr('OPEN', false);
        }
    }

    protected onStateChange(): void {
        if(!this.sprite) {
            return;
        }
        if (this.getAttr('OPEN')) {
            this.sprite.frame = 1;
        } else {
            this.sprite.frame = 0;
        }
    }  
}

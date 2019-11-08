import { Thing } from '../../engine/models/Thing';
import { DoctortillaPlayer } from '../DoctortillaPlayer';
import { Directions } from '../../engine/utils/Directions';

let options = {
    id: 'fridge',
    x: 480,
    y: 97,
    spriteId: 'FRIDGE_SPRITE',
    name: 'FRIDGE',
    goToPosition: {
        x: 524,
        y: 210
    },
    directionToLook: Directions.UP
};

export class Fridge extends Thing {
    constructor() {
        super(options);
    }

    protected lookAction(player: DoctortillaPlayer) { 
       player.say('CREEPY_FRIDGE'); 
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
            this.changeAttr('OPEN', true)
            
            if (!this.getAttr('ONCE_OPENED'))
            {
                this.changeAttr('ONCE_OPENED', true);
                player.say('IT_WAS_KETCHUP')
                .then(() => {
                    return player.wait(1000);
                })
                .then(() => {
                    player.lookAt(Directions.DOWN);
                    return player.say('SCARE_THE_SHIT_OUT_OF_ME');
                });                   
            }
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

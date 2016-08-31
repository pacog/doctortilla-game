import { Player } from '../engine/models/Player';
import { randomText } from '../engine/utils/RandomText';
import { Coin } from './BackstageScene/Coin';
import { Costume } from './BackstageScene/Costume';
import { activeInventory } from '../engine/state/ActiveInventory.singleton';
import { style } from '../engine/ui/Style';

let spriteOptions = new Map();

spriteOptions.set('stand_right', { frames: [0]});
spriteOptions.set('walk_right', { frames: [1, 2, 3, 4, 5, 6]});
spriteOptions.set('talk_right', { frames: [1, 2, 3, 4, 5, 6]});
spriteOptions.set('stand_left', { frames: [0], inverse: true});
spriteOptions.set('walk_left', { frames: [1, 2, 3, 4, 5, 6], inverse: true});
spriteOptions.set('talk_left', { frames: [1, 2, 3, 4, 5, 6], inverse: true});
spriteOptions.set('stand_up', { frames: [14]});
spriteOptions.set('walk_up', { frames: [15, 16, 17, 18, 19, 20]});
spriteOptions.set('talk_up', { frames: [15, 16, 17, 18, 19, 20]});
spriteOptions.set('stand_down', { frames: [7]});
spriteOptions.set('walk_down', { frames: [8, 9, 10, 11, 12, 13]});
spriteOptions.set('talk_down', { frames: [8, 9, 10, 11, 12, 13]});

const options = {
    spriteId: 'DOCTORTILLA_PLAYER_SPRITE',
    initialX: 200,
    initialY: 200,
    xSpeed: 80, //px/s
    ySpeed: 55, //px/s
    animationSpeed: style.DEFAULT_ANIMATION_SPEED,
    spriteOptions: spriteOptions
};


export class DoctortillaPlayer extends Player {
    constructor() {
        super(options);
        this.inventory.add(new Coin());
    }

    reflect(): void {
        this.say(randomText('Now I should say something smart that helps',
            'This is a pretty nice room',
            'Man, I really want to play that concert',
            'Probably I should find the rest of the band...'));
    }

    hasCompleteCostume(): Boolean {
        let inventory = activeInventory.getActiveInventory();
        let costume = <Costume> inventory.getById('costume');

        return costume && costume.isComplete();
    }

    hasCable(): Boolean {
        let inventory = activeInventory.getActiveInventory();
        let cable = inventory.getById('cable');
        return !!cable;
    }

    hasFunnyDrink(): Boolean {
        let inventory = activeInventory.getActiveInventory();
        let glass = <any> inventory.getById('glass');
        return glass && glass.isFunny();
    }

    removeCostume(): void {
        let inventory = activeInventory.getActiveInventory();
        let costume = inventory.getById('costume');
        inventory.remove(costume);
    }

    removeCable(): void {
        let inventory = activeInventory.getActiveInventory();
        let cable = inventory.getById('cable');
        inventory.remove(cable);
    }

    removeGlass(): void {
        let inventory = activeInventory.getActiveInventory();
        let glass = inventory.getById('glass');
        inventory.remove(glass);
    }

    deliveredEverything(): Boolean {
        return this.getAttr('DELIVERED_CABLE') && this.getAttr('DELIVERED_COSTUME') && this.getAttr('DELIVERED_DRINK');
    }

}
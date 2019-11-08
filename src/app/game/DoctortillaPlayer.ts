import { Player } from '../engine/models/Player';
import { randomText } from '../engine/utils/RandomText';
import { Coin } from './BackstageScene/Coin';
import { activeInventory } from '../engine/state/ActiveInventory.singleton';
import { style } from '../engine/ui/Style';
import { scenes } from '../engine/state/Scenes.singleton';

let spriteOptions = new Map();

spriteOptions.set('stand_right', { frames: [0]});
spriteOptions.set('walk_right', { frames: [1, 2, 3, 4, 5, 6]});
spriteOptions.set('talk_right', { frames: [21, 22, 23, 24, 25, 26]});
spriteOptions.set('stand_left', { frames: [0], inverse: true});
spriteOptions.set('walk_left', { frames: [1, 2, 3, 4, 5, 6], inverse: true});
spriteOptions.set('talk_left', { frames: [21, 22, 23, 24, 25, 26], inverse: true});
spriteOptions.set('stand_up', { frames: [14]});
spriteOptions.set('walk_up', { frames: [15, 16, 17, 18, 19, 20]});
spriteOptions.set('talk_up', { frames: [14]});
spriteOptions.set('stand_down', { frames: [7]});
spriteOptions.set('walk_down', { frames: [8, 9, 10, 11, 12, 13]});
spriteOptions.set('talk_down', { frames: [27, 28, 29, 30, 31, 32]});
spriteOptions.set('give_glass', { frames: [33, 34, 35, 36]});
spriteOptions.set('pierce_balloon', { frames: [37, 38, 39, 40]});

const options = {
    spriteId: 'DOCTORTILLA_PLAYER_SPRITE',
    initialX: 93,
    initialY: 184,
    xSpeed: 80, //px/s
    ySpeed: 55, //px/s
    animationSpeed: style.DEFAULT_ANIMATION_SPEED,
    spriteOptions: spriteOptions
};

const MIN_REFLECT_ANSWERS = 4;

export class DoctortillaPlayer extends Player {
    constructor() {
        super(options);
        this.inventory.add(new Coin());
    }

    reflect(): void {
        let possibleReflections = this.getPossibleReflections();
        this.say(randomText.apply(this, possibleReflections));
    }

    hasCompleteCostume(): Boolean {
        return this.getAttr('COSTUME_COMPLETE');
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

    protected onStateChange() {
        if(this.deliveredEverything()) {
            let bili = scenes.getSceneById('BACKYARD').getThingById('bili');
            bili.changeAttr('DRUNK', true);

            let stageDoor = scenes.getSceneById('BACKSTAGE').getThingById('backstage_door_to_stage');
            stageDoor.changeAttr('CANGO', true);
        }
    }

    private getPossibleReflections(): Array<string> {

        const FILLERS = [
            'NOW_I_SHOULD_SAY_SOMETHING_SMART_THAT_HELPS',
            'WHY_IS_EVERYTHING_SO_PIXELY',
            'ONE_CONCERT_A_YEAR_IS_TOO_MUCH_PRESSURE',
            'THINK_PACO_THINK'
        ];

        let thingsToSay = this.getThingsToSayForSituation();

        return fillArrayWithFillers(thingsToSay, FILLERS);
    }

    private getThingsToSayForSituation(): Array<string> {


        if(!this.getAttr('TALKED_TO_THE_BAND')) {
            return ['FIRST_OF_ALL_I_SHOULD_TALK_TO_THE_BAND', 'I_WONDER_IF_THE_GUYS_HAVE_EVERYTHING_READY'];
        }

        if(!this.deliveredEverything()) {
            let result: Array<string> = [];
            if(!this.getAttr('DELIVERED_CABLE')) {
                result.push('WHERE_COULD_I_FIND_A_CABLE');
                result.push('IS_THAT_A_CABLE_BEHIND_THE_VENDING_MACHINE');
            }
            if(!this.getAttr('DELIVERED_COSTUME')) {
                result.push('MY_GRANDFATHER_SAID_A_COSTUME_MUST_HAVE_3_THINGS');
                result.push('MAYBE_I_CAN_BUILD_A_COSTUME_MYSELF');
                result.push('I_COULD_MAKE_A_HAWAIIAN_COSTUME');
            }
            if(!this.getAttr('DELIVERED_DRINK')) {
                result.push('MAYBE_SANTI_NEEDS_SOMETHING_TO_DRINK');
                result.push('I_BET_THAT_SUSPICIOS_WHITE_POWDER_FROM_THE_TABLE_CAN_MAKE_SOMEBODY_LESS_SHY');
            }
            return result;
        } else {
            if(this.getAttr('TALKED_TO_DRUNK_BILI')) {
                return ['I_SHOULD_SOBER_BILI_UP', 'MAYBE_I_CAN_SCARE_HIM_SO_HE_GETS_SOBER'];
            } else {
                return ['I_SHOULD_GO_FIND_BILI'];
            }
        }

    }
}


function fillArrayWithFillers(arrayToFill: Array<string>, fillers: Array<string>, minSize: number = MIN_REFLECT_ANSWERS): Array<string> {
    let result = arrayToFill.slice();
    if((result.length + fillers.length) < minSize) {
        throw 'ERROR there are not enough fillers.';
    }
    let fillersCopy = fillers.slice();
    while(result.length < minSize) {
        result.push(extractRandomMemberOfArray(fillersCopy));
    }
    return result;
}

function extractRandomMemberOfArray(mutableArray: Array<string>): string {
    if(!mutableArray || !mutableArray.length) {
        throw 'ERROR trying to extract element from empty array';
    }
    let randomIndex = Math.floor(Math.random() * mutableArray.length);
    let result = mutableArray[randomIndex];
    mutableArray.splice(randomIndex, 1);
    return result;
}
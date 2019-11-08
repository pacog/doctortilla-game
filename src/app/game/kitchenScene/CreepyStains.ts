import { Thing } from '../../engine/models/Thing';
import { DoctortillaPlayer } from '../DoctortillaPlayer';
import { scenes } from '../../engine/state/Scenes.singleton';
import { randomText } from '../../engine/utils/RandomText';
import { selectedThing } from '../../engine/state/SelectedObjects';

let options = {
    id: 'CreepyStains',
    x: 304,
    y: 91,
    spriteId: 'CREEPY_STAINS',
    name: 'CREEPY_STAINS',
    isForeground: true
};

export class CreepyStains extends Thing {
    constructor() {
        super(options);
    }

    protected lookAction(player: DoctortillaPlayer) { 
        let fridge = scenes.currentScene.getThingById('fridge');
        if (!fridge.getAttr('ONCE_OPENED'))
        {
            player.say('I_HOPE_ITS_KETCHUP'); 
        } else {
            player.say('SHOULD_BE_KETCHUP_TOO'); 
        }       
    }
    protected useAction(player: DoctortillaPlayer) {
        if (selectedThing.thing.id === 'flashlight') {
            player.say('I_CAN_SEE_THEN_GOOD_ENOUGH');   
        }
    }

    protected takeAction(player: DoctortillaPlayer) { 
        player.say(randomText(
            'THEY_ARE_DISGUSTING',
            'SHOULD_CALL_HEALTH_DEPARTMENT',
            'NEVER_EAT_ANYTHING_FROM_HERE'
        )); 
     }
}

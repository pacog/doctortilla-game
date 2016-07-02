import { Thing } from './Thing';
import { Player } from './Player';
import { IPoint, IGoToSceneOptions } from '../utils/Interfaces';
import { Verbs } from '../stores/Verbs.store';
import { actionDispatcher, Actions } from '../utils/ActionDispatcher';

interface IDoorOptions {
    id: string,
    name: string,
    x: number,
    y: number,
    spriteId: string,
    goToPosition: IPoint,
    destinationSceneId: string,
    relatedDoorId: string
}

export class Door extends Thing {

    constructor(protected doorOptions: IDoorOptions) {
        super(doorOptions);
    }

    get name(): string {
        return this.options.name || 'door';
    }

    getPreferredAction(): Verbs {
        if (this.getAttr('OPEN')) {
            return Verbs.CLOSE;
        } else {
            return Verbs.OPEN;
        }
    }

    forceOpen(): void {
        this.changeAttr('OPEN', true);
    }

    goToAction(player: Player): void {
        this.goToDestinationIfOpen(player);
    }

    openAction(player: Player): void  {
        player.goToThing(this)
            .then(() => this.open(player));
    }

    closeAction(player: Player): void  {
        player.goToThing(this)
            .then(() => this.close(player));
    }

    lookAction(player: Player): void  {
        player.say('That\'s a wonderful door. So woody.');
    }

    private open(player: Player): void {
        if (this.getAttr('OPEN')) {
            player.say('It is already open!');
        } else {
            this.changeAttr('OPEN', true);
        }
    }

    private close(player: Player): void {
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

    private goToDestinationIfOpen(player: Player): void {
        player.goToThing(this).then(() => {
            if (this.getAttr('OPEN')) {
                let goToSceneOptions: IGoToSceneOptions = {
                    sceneId: this.doorOptions.destinationSceneId,
                    relatedDoorId: this.doorOptions.relatedDoorId
                };
                actionDispatcher.execute(Actions.GO_TO_SCENE, goToSceneOptions);
            }
        });
    }
}

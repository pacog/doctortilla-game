import { Inventory } from './Inventory';
import { Thing } from './Thing';
import { PlayerMovementHandler } from './PlayerMovementHandler';
import { uiLayers } from '../ui/UILayers.singleton';
import { IPoint, ISpriteInfo } from '../utils/Interfaces';
import { Directions, getDirectionName } from '../utils/Directions';
import { SpeechBubble } from '../ui/SpeechBubble';

interface IPlayerOptions {
    spriteId: string,
    initialX: number,
    initialY: number,
    xSpeed: number, //px/s
    ySpeed: number, //px/s
    animationSpeed: number,
    spriteOptions: Map<string, ISpriteInfo>;
}

export abstract class Player {

    inventory: Inventory;

    private _sprite: Phaser.Sprite;
    private _direction: Directions;
    private speechBubble: SpeechBubble;
    private _state: Map<string, any>;
    private movementHandler: PlayerMovementHandler;

    constructor(private options : IPlayerOptions) {
        this.inventory = new Inventory();
        this.movementHandler = new PlayerMovementHandler(this);
        this.createSprite();
        this.direction = Directions.RIGHT;
        this.playStandAnimation();
        this.speechBubble = new SpeechBubble({
            owner: this
        });
        this._state = new Map();
    }

    moveTo(destination: IPoint): Promise<void> {
        return this.movementHandler.moveTo(destination);
    }

    get sprite(): Phaser.Sprite {
        return this._sprite;
    }

    get speed(): IPoint {
        let speed = {
            x: this.options.xSpeed,
            y: this.options.ySpeed,
        }
        return speed;
    }

    get direction(): Directions {
        return this._direction;
    }

    set direction(newDirection: Directions) {
        this._direction = newDirection;
    }

    goToThing(thing: Thing): Promise<void> {
        return this.moveTo(thing.getPositionToGoTo())
                .then(() => {
                    let direction = thing.getDirectionToLook();
                    if(direction) {
                        this.lookAt(direction);
                    }
                });
    }

    lookAt(direction: Directions) {
        this.direction = direction;
        this.playStandAnimation();
    }

    say(text: string): Promise<void> {
        this.playTalkingAnimation();
        return this.speechBubble.say(text).then(() => {
            this.stopTalkingAnimation();
        });
    }

    getPositionOnTop(): IPoint{
        var result = {
            x: this.sprite.x,
            y: Math.round(this.sprite.getBounds().y) - 10
        };
        return result;
    }

    addObjectToInventory(thing: Thing): void {
        this.inventory.add(thing);
    }

    teleportTo(destination: IPoint): void {
        this.movementHandler.moveToWithoutAnimation(destination);
    }

    get state(): Map<string, any> {
        return this._state;
    }

    set state(newState: Map<string, any>){
        if (newState) {
            this._state = newState;
            this.onStateChange();
        }
    }

    changeAttr(attrName: string, value: any) {
        this._state.set(attrName, value);
        this.onStateChange();
    }

    getAttr(attrName: string) {
        return this._state.get(attrName);
    }

    playWalkingAnimation(): void {
        let directionName = getDirectionName(this.direction);
        let spriteState = 'walk_' + directionName;
        this._sprite.animations.play(spriteState);
        this.flipXIfNeeded(spriteState);
    }

    playStandAnimation(): void {
        let directionName = getDirectionName(this.direction);
        let spriteState = 'stand_' + directionName;
        this._sprite.animations.play(spriteState);
        this.flipXIfNeeded(spriteState);
    }

    updateOnTweenMove(): void {
        if(this.speechBubble.isShown()) {
            this.speechBubble.updatePosition();
        }
    }

    stopAnimations(): void {
        this.playStandAnimation();
        this._sprite.animations.stop();
    }

    abstract reflect(): void

    //This method can be overwritten in child classes
    protected onStateChange() {}


    private createSprite(): void {
        this._sprite = uiLayers.player.create(
            this.options.initialX,
            this.options.initialY,
            this.options.spriteId
        );
        this._sprite.anchor.setTo(0.5, 0.99);
        uiLayers.player.sort('z', Phaser.Group.SORT_ASCENDING);
        this.addSpriteAnimations();
    }

    private addSpriteAnimations(): void {
        this.options.spriteOptions.forEach( (spritePosition, key) => {
            this._sprite.animations.add(key, spritePosition.frames, this.options.animationSpeed, true);
        });
    }

    private playTalkingAnimation(): void {
        let directionName = getDirectionName(this.direction);
        let spriteState = 'talk_' + directionName;
        this._sprite.animations.play(spriteState);
        this.flipXIfNeeded(spriteState);
    }

    private stopTalkingAnimation(): void {
        if (this._sprite.animations &&
            this._sprite.animations.name &&
            (this._sprite.animations.name.indexOf('talk') === 0)) {
            this.stopAnimations();
        }
    }

    private flipXIfNeeded(spriteState: string): void {
        let spriteStateOptions = this.options.spriteOptions.get(spriteState);
        if (spriteStateOptions && spriteStateOptions.inverse) {
            this._sprite.scale.x = -1;
        } else {
            this._sprite.scale.x = 1;
        }
    }

}

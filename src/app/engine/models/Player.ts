import { Inventory } from './Inventory';
import { Thing } from './Thing';
import { uiLayers } from '../ui/UILayers.singleton';
import { IPoint, ISpriteInfo } from '../utils/Interfaces';
import { Directions, getDirectionName } from '../utils/Directions';
import { phaserGame } from '../state/PhaserGame.singleton';
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

interface ITimeoutWithPromise {
    timeoutId: number,
    promise: Promise<any>,
    resolveCallback: () => void,
    rejectCallback: () => void
}

export abstract class Player {

    inventory: Inventory;

    private _sprite: Phaser.Sprite;
    private tween: Phaser.Tween;
    private direction: Directions;
    private willMovePromise: ITimeoutWithPromise;
    private speechBubble: SpeechBubble;

    constructor(private options : IPlayerOptions) {
        this.inventory = new Inventory();
        this.createSprite();
        this.direction = Directions.RIGHT;
        this.playStandAnimation();
        this.speechBubble = new SpeechBubble({
            owner: this
        });
    }

    moveTo(destination: IPoint): Promise<void> {
        this.cancelCurrentTween();
        this.cancelCurrentMovePromise();
        let timeToAnimate = this.getTimeForAnimation(destination);

        if (timeToAnimate) {
            this.updateDirection(destination);
            this.playWalkingAnimation();
            this.tween = phaserGame.value.add.tween(this._sprite);
            this.tween.to({ x: destination.x, y: destination.y }, timeToAnimate, 'Linear', true, 0);
            this.tween.onComplete.add(this.stopAnimations, this);
        }

        this.willMovePromise = this.createMovePromise(timeToAnimate);

        return this.willMovePromise.promise;
    }

    get sprite(): Phaser.Sprite {
        return this._sprite;
    }

    goToThing(thing: Thing): Promise<void> {
        return this.moveTo(thing.getPositionToGoTo());
    }

    say(text: string): Promise<void> {
        return this.speechBubble.say(text);
    }

    getPositionOnTop(): IPoint{
        var result = {
            x: this.sprite.x,
            y: Math.round(this.sprite.getBounds().y) - 10
        };
        return result;
    }

    private createSprite(): void {
        this._sprite = uiLayers.player.create(
            this.options.initialX,
            this.options.initialY,
            this.options.spriteId
        );
        this._sprite.anchor.setTo(0.5, 0.99);
        this._sprite.inputEnabled = true;
        uiLayers.player.sort('z', Phaser.Group.SORT_ASCENDING);
        this.addSpriteAnimations();
    }

    private addSpriteAnimations(): void {
        this.options.spriteOptions.forEach( (spritePosition, key) => {
            this._sprite.animations.add(key, spritePosition.frames, this.options.animationSpeed, true);
        });
    }

    private createMovePromise(timeToMove: number = 0): ITimeoutWithPromise {
        var result: ITimeoutWithPromise = {
            timeoutId: null,
            promise: null,
            resolveCallback: null,
            rejectCallback: null
        };

        result.timeoutId = window.setTimeout(
            () => this.resolveMovePromise(),
            timeToMove);

        result.promise = new Promise(function (resolve, reject) {
            result.resolveCallback = resolve;
            result.rejectCallback = reject;
        });

        return result;
    }

    private resolveMovePromise() {
        if (this.willMovePromise) {
            this.willMovePromise.resolveCallback();
            this.willMovePromise = null;
        }
    }

    private cancelCurrentMovePromise() {
        if (this.willMovePromise) {
            window.clearTimeout(this.willMovePromise.timeoutId);
            // We could reject the promise like this, but there is no need
            // this.willMovePromise.rejectCallback();
            this.willMovePromise = null;
        }
    }

    private cancelCurrentTween(): void {
        if (this.tween && this.tween.isRunning) {
            this.tween.stop();
            this.tween.onComplete.removeAll();
        }
    }

    private getTimeForAnimation(destination: IPoint): number {
        let angleBetween = this.getAngleToDesiredPosition(destination);
        let diff1 = this._sprite.x - destination.x;
        let diff2 = this._sprite.y - destination.y;
        let distance = Math.sqrt((diff1 * diff1) + (diff2 * diff2));
        let speedFromX = Math.abs(Math.cos(angleBetween)) * distance / this.options.xSpeed;
        let speedFromY = Math.abs(Math.sin(angleBetween)) * distance / this.options.ySpeed;

        return 1000 * ((speedFromX + speedFromY) / 2);
    }

    private getAngleToDesiredPosition(destination: IPoint): number {
        return Math.atan2(this._sprite.y - destination.y,
            this._sprite.x - destination.x);
    }

    private updateDirection(destination: IPoint): void {
        let angleBetween = this.getAngleToDesiredPosition(destination);
        let angleDegrees = (angleBetween * 180 / Math.PI);

        if ((angleDegrees >= -45) && (angleDegrees <= 45)) {
            this.direction = Directions.LEFT;
        } else if ((angleDegrees >= 45) && (angleDegrees <= 135)) {
            this.direction = Directions.UP;
        } else if ((angleDegrees >= -135) && (angleDegrees <= -45)) {
            this.direction = Directions.DOWN;
        } else {
            this.direction = Directions.RIGHT;
        }
    }

    private playWalkingAnimation(): void {
        let directionName = getDirectionName(this.direction);
        let spriteState = 'walk_' + directionName;
        this._sprite.animations.play(spriteState);
        this.flipXIfNeeded(spriteState);
    }

    private flipXIfNeeded(spriteState: string): void {
        let spriteStateOptions = this.options.spriteOptions.get(spriteState);
        if (spriteStateOptions && spriteStateOptions.inverse) {
            this._sprite.scale.x = -1;
        } else {
            this._sprite.scale.x = 1;
        }
    }

    private stopAnimations(): void {
        this.playStandAnimation();
        this._sprite.animations.stop();
    }

    private playStandAnimation(): void {
        let directionName = getDirectionName(this.direction);
        let spriteState = 'stand_' + directionName;
        this._sprite.animations.play(spriteState);
        this.flipXIfNeeded(spriteState);
    }

}

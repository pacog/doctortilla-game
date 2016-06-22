import { Inventory } from './Inventory';
import { uiLayers } from '../ui/UILayers.singleton';
import { IPoint } from '../utils/Interfaces';
import { Directions, getDirectionName } from '../utils/Directions';
import { phaserGame } from '../state/PhaserGame.singleton';

interface IPlayerOptions {
    spriteId: string,
    initialX: number,
    initialY: number,
    xSpeed: number, //px/s
    ySpeed: number, //px/s
    animationSpeed: number
}

export abstract class Player {

    inventory: Inventory;

    private sprite: Phaser.Sprite;
    private tween: Phaser.Tween;
    private direction: Directions;

    constructor(private options : IPlayerOptions) {
        this.inventory = new Inventory();
        this.createSprite();
    }

    moveTo(destination: IPoint): Promise<void> {
        this.cancelCurrentTween();
        // this.cancelCurrentMovePromise();
        let timeToAnimate = this.getTimeForAnimation(destination);

        if (timeToAnimate) {
            this.updateDirection(destination);
            this.playWalkingAnimation();
            this.tween = phaserGame.value.add.tween(this.sprite);
            this.tween.to({ x: destination.x, y: destination.y }, timeToAnimate, 'Linear', true, 0);
            // this.tween.onComplete.add(this._stopAnimations, this);
        }

        // this._willMovePromise = this._createMovePromise(timeToAnimate);

        // return this._willMovePromise.promise;
        return null; //TODO return promise or empty promise
    }

    private createSprite(): void {
        this.sprite = uiLayers.player.create(
            this.options.initialX,
            this.options.initialY,
            this.options.spriteId
        );
        this.sprite.anchor.setTo(0.5, 0.99);
        this.sprite.inputEnabled = true;
        uiLayers.player.sort('z', Phaser.Group.SORT_ASCENDING);
    }

    private cancelCurrentTween(): void {
        if (this.tween && this.tween.isRunning) {
            this.tween.stop();
            this.tween.onComplete.removeAll();
        }
    }

    private getTimeForAnimation(destination: IPoint): number {
        let angleBetween = this.getAngleToDesiredPosition(destination);
        let diff1 = this.sprite.x - destination.x;
        let diff2 = this.sprite.y - destination.y;
        let distance = Math.sqrt((diff1 * diff1) + (diff2 * diff2));
        let speedFromX = Math.abs(Math.cos(angleBetween)) * distance / this.options.xSpeed;
        let speedFromY = Math.abs(Math.sin(angleBetween)) * distance / this.options.ySpeed;

        return 1000 * ((speedFromX + speedFromY) / 2);
    }

    private getAngleToDesiredPosition(destination: IPoint): number {
        return Math.atan2(this.sprite.y - destination.y,
            this.sprite.x - destination.x);
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
        // let directionName = getDirectionName(this.direction);
        // let spriteState = 'walk_' + directionName;
        // this.sprite.animations.play(spriteState);
        // this._flipXIfNeeded(spriteState);
    }

}
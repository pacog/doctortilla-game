import { Player } from './Player';
import { IPoint, ITimeoutWithPromise } from '../utils/Interfaces';
import { phaserGame } from '../state/PhaserGame.singleton';
import { Directions } from '../utils/Directions';
import { scenes } from '../state/Scenes.singleton';

export class PlayerMovementHandler {

    private tween: Phaser.Tween;
    private willMovePromise: ITimeoutWithPromise;

    constructor(private player: Player) {

    }

    moveTo(destination: IPoint): Promise<void> {
        //TODO: get list of places to go
        //Execute them one by one
        //Make it possible to stop
        this.cancelCurrentTween();
        this.cancelCurrentMovePromise();
        let timeToAnimate = this.getTimeForAnimation(destination);

        if (timeToAnimate) {
            this.updateDirection(destination);
            this.player.playWalkingAnimation();
            this.tween = phaserGame.value.add.tween(this.player.sprite);
            this.tween.to({ x: destination.x, y: destination.y }, timeToAnimate, 'Linear', true, 0);
            this.tween.onComplete.add(this.player.stopAnimations, this.player);
            this.tween.onUpdateCallback(this.player.updateOnTweenMove, this.player);
        }

        this.willMovePromise = this.createMovePromise(timeToAnimate);

        return this.willMovePromise.promise;
    }

    moveToWithoutAnimation(destination: IPoint): void {
        let safePosition = scenes.currentScene.boundaries.getPositionInside(destination);
        this.updateDirection(safePosition);
        this.cancelCurrentTween();
        this.cancelCurrentMovePromise();
        this.player.playStandAnimation();
        this.player.sprite.x = safePosition.x;
        this.player.sprite.y = safePosition.y;
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
        let diff1 = this.player.sprite.x - destination.x;
        let diff2 = this.player.sprite.y - destination.y;
        let distance = Math.sqrt((diff1 * diff1) + (diff2 * diff2));
        let speedFromX = Math.abs(Math.cos(angleBetween)) * distance / this.player.speed.x;
        let speedFromY = Math.abs(Math.sin(angleBetween)) * distance / this.player.speed.y;

        return 1000 * ((speedFromX + speedFromY) / 2);
    }

    private getAngleToDesiredPosition(destination: IPoint): number {
        return Math.atan2(this.player.sprite.y - destination.y,
            this.player.sprite.x - destination.x);
    }

    private updateDirection(destination: IPoint): void {
        let angleBetween = this.getAngleToDesiredPosition(destination);
        let angleDegrees = (angleBetween * 180 / Math.PI);

        if ((angleDegrees >= -45) && (angleDegrees <= 45)) {
            this.player.direction = Directions.LEFT;
        } else if ((angleDegrees >= 45) && (angleDegrees <= 135)) {
            this.player.direction = Directions.UP;
        } else if ((angleDegrees >= -135) && (angleDegrees <= -45)) {
            this.player.direction = Directions.DOWN;
        } else {
            this.player.direction = Directions.RIGHT;
        }
    }

}
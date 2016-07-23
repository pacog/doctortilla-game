import { Player } from './Player';
import { IPoint, ITimeoutWithPromise } from '../utils/Interfaces';
import { phaserGame } from '../state/PhaserGame.singleton';
import { Directions } from '../utils/Directions';
import { scenes } from '../state/Scenes.singleton';
import { pathFinder } from './PathFinder';


class SingleMove {

    private tween: Phaser.Tween;
    private willMovePromise: ITimeoutWithPromise;

    constructor(private player: Player, private destination: IPoint) {
        let timeToAnimate = this.getTimeForAnimation(destination);

        if (timeToAnimate) {
            this.player.updateDirection(destination);
            this.player.playWalkingAnimation();
            this.tween = phaserGame.value.add.tween(this.player.sprite);
            this.tween.to({ x: destination.x, y: destination.y }, timeToAnimate, 'Linear', true, 0);
            this.tween.onUpdateCallback(this.player.updateOnTweenMove, this.player);
        }

        this.willMovePromise = this.createMovePromise(timeToAnimate);
    }

    whenFinished(): Promise<void> {
        return this.willMovePromise.promise;
    }

    cancel() {
        this.destroy();
    }

    destroy() {
        this.cancelCurrentTween();
        this.cancelCurrentMovePromise();
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
        let angleBetween = this.player.getAngleToDesiredPosition(destination);
        let diff1 = this.player.sprite.x - destination.x;
        let diff2 = this.player.sprite.y - destination.y;
        let distance = Math.sqrt((diff1 * diff1) + (diff2 * diff2));
        let speedFromX = Math.abs(Math.cos(angleBetween)) * distance / this.player.speed.x;
        let speedFromY = Math.abs(Math.sin(angleBetween)) * distance / this.player.speed.y;

        return 1000 * ((speedFromX + speedFromY) / 2);
    }

}


export class PlayerMovementHandler {

    private currentPath: Array<IPoint>;
    private currentSingleMove: SingleMove;
    private resolvePromiseCallback: ()=>void;

    constructor(private player: Player) {}

    moveTo(destination: IPoint): Promise<{}> {

        this.cancelCurrentMove();

        let promise = new Promise((resolve, reject) => {
            this.resolvePromiseCallback = resolve;
        });

        this.currentPath = pathFinder.getPath(this.player.position, destination, scenes.currentScene.boundaries);
        this.goToNextPosition();

        return promise;

    }

    private goToNextPosition() {
        if(this.currentPath && this.currentPath.length) {
            this.currentSingleMove = new SingleMove(this.player, this.currentPath.shift());
            this.currentSingleMove.whenFinished().then(() => {
                this.goToNextPosition();
            });
        } else {
            if(this.resolvePromiseCallback) {
                this.player.stopAnimations();
                this.resolvePromiseCallback();
            }
        }
    }

    moveToWithoutAnimation(destination: IPoint): void {
        let safePosition = scenes.currentScene.boundaries.getPositionInside(destination);
        this.player.updateDirection(safePosition);
        this.cancelCurrentMove();
        this.player.playStandAnimation();
        this.player.sprite.x = safePosition.x;
        this.player.sprite.y = safePosition.y;
    }


    private cancelCurrentMove() {
        if(this.currentSingleMove) {
            this.player.stopAnimations();
            this.currentSingleMove.cancel();
            this.resolvePromiseCallback = null;
        }
    }

}
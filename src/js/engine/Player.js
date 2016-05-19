/* global Promise */

var Directions = require('./directions.js');
var Text = require('./Text.js');
var currentScene = require('./CurrentScene.singleton.js');

class Player {

    constructor(phaserGame, options) {
        this.options = options;

        this.phaserGame = phaserGame;
        this.createSprite();

        this.direction = Directions.RIGHT;
        this._playStandAnimation();
        this.sprite.animations.stop();
    }

    getPhaserObject() {
        return this.sprite;
    }

    bringToTop() {
        this.sprite.bringToTop();
    }

    createSprite() {
        this.sprite = this.phaserGame.add.sprite(
                        this.options.INITIAL_X,
                        this.options.INITIAL_Y,
                        this.options.SPRITE_ID);
        this._addSpriteAnimations();
        

        this.sprite.anchor.setTo(0.5, 0.99);
    }

    say(text) {
        this._destroyPrevText();
        this._textBeingSaid = new Text(this.phaserGame, {
            text: text,
            position: this._getPositionOnTop(),
            autoDestroy: true
        });
    }

    goToThing(thing) {
        return this.moveTo(thing.getPositionToGoTo());
    }

    _destroyPrevText() {
        if (this._textBeingSaid) {
            this._textBeingSaid.destroy();
            this._textBeingSaid = null;
        }
    }

    _addSpriteAnimations() {
        this.options.SPRITE_OPTIONS.forEach( (spritePosition, key) => {
            this.sprite.animations.add(key, spritePosition.frames, this.options.ANIMATION_SPEED, true);
        });
    }

    _getPositionOnTop() {
        var result = {
            x: this.sprite.x,
            y: Math.round(this.sprite.getBounds().y) - 10
        };
        return result;
    }

    moveTo(nonSafePosition) {
        let pos = currentScene.value.boundaries.getPositionInside(nonSafePosition.x, nonSafePosition.y);

        this._updateDirection(pos);
        this._cancelCurrentTween();
        this._cancelCurrentMovePromise();
        this._playWalkingAnimation();
        
        let timeToAnimate = this._getTimeForAnimation(pos);

        this._willMovePromise = this._createMovePromise(timeToAnimate);

        this.tween = this.phaserGame.add.tween(this.sprite);
        this.tween.to({ x: pos.x, y: pos.y }, timeToAnimate, 'Linear', true, 0);
        this.tween.onComplete.add(this._stopAnimations, this);

        return this._willMovePromise.promise;
    }

    _createMovePromise(timeToMove) {
        var result = {};

        result.timeoutId = window.setTimeout(() => this._resolveMovePromise(result), timeToMove);
        result.promise = new Promise(function (resolve, reject) {
            result.resolveCallback = resolve;
            result.rejectCallback = reject;
        });

        return result;
    }

    _resolveMovePromise() {
        if (this._willMovePromise) {
            this._willMovePromise.resolveCallback();
            this._willMovePromise = null;
        }
    }

    _cancelCurrentMovePromise() {
        if (this._willMovePromise) {
            window.clearTimeout(this._willMovePromise.timeoutId);
            // We could reject the promise like this, but there is no need
            // this._willMovePromise.rejectCallback();
            this._willMovePromise = null;
        }
    }

    _updateDirection(pos) {
        let angleBetween = this._getAngleToDesiredPosition(pos);
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

    _cancelCurrentTween() {
        if (this.tween && this.tween.isRunning) {
            this.tween.stop();
            this.tween.onComplete.removeAll();
        }
    }

    _playWalkingAnimation() {
        let directionName = Directions.getName(this.direction);
        let spriteState = 'walk_' + directionName;
        this.sprite.animations.play(spriteState);
        this._flipXIfNeeded(spriteState);
    }

    _flipXIfNeeded(spriteState) {
        let spriteStateOptions = this.options.SPRITE_OPTIONS.get(spriteState);
        if (spriteStateOptions && spriteStateOptions.inverse) {
            this.sprite.scale.x = -1;
        } else {
            this.sprite.scale.x = 1;
        }
    }

    _playStandAnimation() {
        let directionName = Directions.getName(this.direction);
        let spriteState = 'stand_' + directionName;
        this.sprite.animations.play(spriteState);
        this._flipXIfNeeded(spriteState);
    }

    _stopAnimations() {
        this._playStandAnimation();
        this.sprite.animations.stop();
    }

    _getTimeForAnimation(desiredPos) {
        let angleBetween = this._getAngleToDesiredPosition(desiredPos);
        let diff1 = this.sprite.x - desiredPos.x;
        let diff2 = this.sprite.y - desiredPos.y;
        let distance = Math.sqrt((diff1 * diff1) + (diff2 * diff2));

        let speedFromX = Math.abs(Math.cos(angleBetween)) * distance / this.options.X_SPEED;
        let speedFromY = Math.abs(Math.sin(angleBetween)) * distance / this.options.Y_SPEED;

        return 1000 * ((speedFromX + speedFromY) / 2);
    }

    _getAngleToDesiredPosition(desiredPos) {
        return Math.atan2(this.sprite.y - desiredPos.y,
                                      this.sprite.x - desiredPos.x);
    }

}

module.exports = Player;
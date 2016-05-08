var Directions = require('./directions.js');

class Player {

    //TODO: leave here general player functionality
    //Create model for doctortilla game that inherits from this
    //Do all game related stuff and initial config in game player model

    constructor(phaserGame) {
        this._initConstants();
        this.phaserGame = phaserGame;
        this.createSprite();
        this._playStandAnimation();
        this.sprite.animations.stop();
    }

    _initConstants() {
        this.BG = 'vaca_sprite';
        this.direction = Directions.RIGHT;
        this.INITIAL_X = 200;
        this.INITIAL_Y = 300;
        this.X_SPEED = 80; //px/s
        this.Y_SPEED = 55; //px/s
        this.ANIMATION_SPEED = 6;
    }

    createSprite() {
        this.sprite = this.phaserGame.add.sprite(
                        this.INITIAL_X,
                        this.INITIAL_Y,
                        this.BG);
        this._addSpriteAnimations();
        

        this.sprite.anchor.setTo(0.5, 0.99);
    }

    _addSpriteAnimations() {
        this.sprite.animations.add('stand_right', [0], this.ANIMATION_SPEED, true);
        this.sprite.animations.add('walk_right', [1, 2, 3, 4, 5, 6], this.ANIMATION_SPEED, true);

        this.sprite.animations.add('stand_left', [0], 6, true);
        this.sprite.animations.add('walk_left', [1, 2, 3, 4, 5, 6], this.ANIMATION_SPEED, true);

        this.sprite.animations.add('stand_up', [0], 6, true);
        this.sprite.animations.add('walk_up', [1, 2, 3, 4, 5, 6], this.ANIMATION_SPEED, true);

        this.sprite.animations.add('stand_down', [7], 6, true);
        this.sprite.animations.add('walk_down', [7, 8, 9, 10, 11, 12], this.ANIMATION_SPEED, true);
    }

    moveTo(pos) {
        this._updateDirection(pos);
        this._cancelCurrentTween();
        this._playWalkingAnimation();
        
        let timeToAnimate = this._getTimeForAnimation(pos);

        this.tween = this.phaserGame.add.tween(this.sprite);
        this.tween.to({ x: pos.x, y: pos.y }, timeToAnimate, 'Linear', true, 0);
        this.tween.onComplete.add(this._stopAnimations, this);
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
        var directionName = Directions.getName(this.direction);
        this.sprite.animations.play('walk_' + directionName);
        this._flipXIfNeeded();
    }

    _flipXIfNeeded() {
        if (this.direction === Directions.LEFT) {
            this.sprite.scale.x = -1;
        } else {
            this.sprite.scale.x = 1;
        }
    }

    _playStandAnimation() {
        var directionName = Directions.getName(this.direction);
        this.sprite.animations.play('stand_' + directionName);
        this._flipXIfNeeded();
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

        let speedFromX = Math.abs(Math.cos(angleBetween)) * distance / this.X_SPEED;
        let speedFromY = Math.abs(Math.sin(angleBetween)) * distance / this.Y_SPEED;

        return 1000 * ((speedFromX + speedFromY) / 2);
    }

    _getAngleToDesiredPosition(desiredPos) {
        return Math.atan2(this.sprite.y - desiredPos.y,
                                      this.sprite.x - desiredPos.x);
    }

}

module.exports = Player;
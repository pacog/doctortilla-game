class Player {

    constructor(phaserGame) {
        this.BG = 'vaca_sprite';
        this.INITIAL_X = 200;
        this.INITIAL_Y = 300;
        this.X_SPEED = 80; //px/s
        this.Y_SPEED = 55; //px/s
        this.phaserGame = phaserGame;
        this.createSprite();
    }

    createSprite() {
        this.sprite = this.phaserGame.add.sprite(
                    this.INITIAL_X,
                    this.INITIAL_Y,
                    this.BG);
        this.sprite.animations.add('stand_right', [0], 6, true);
        this.sprite.animations.add('walk_right', [1, 2, 3, 4, 5, 6], 6, true);

        this.sprite.anchor.setTo(0.5, 0.99);
    }

    moveTo(pos) {
        this.sprite.animations.play('walk_right');
        var timeToAnimate = this._getTime(pos);
        if (this.tween && this.tween.isRunning) {
            this.tween.stop();
        }

        this.tween = this.phaserGame.add.tween(this.sprite);
        this.tween.to({ x: pos.x, y: pos.y }, timeToAnimate, 'Linear', true, 0);
        this.tween.onComplete.add(this._stopAnimations, this);
    }

    _stopAnimations() {
        this.sprite.animations.play('stand_right');
        this.sprite.animations.stop();
    }

    _getTime(desiredPos) {
        var angleBetween = Math.atan2(this.sprite.y - desiredPos.y,
                                      this.sprite.x - desiredPos.x);
        var diff1 = this.sprite.x - desiredPos.x;
        var diff2 = this.sprite.y - desiredPos.y;
        var distance = Math.sqrt((diff1 * diff1) + (diff2 * diff2));

        var speedFromX = Math.abs(Math.cos(angleBetween)) * distance / this.X_SPEED;
        var speedFromY = Math.abs(Math.sin(angleBetween)) * distance / this.Y_SPEED;

        return 1000 * ((speedFromX + speedFromY) / 2);
    }

}

module.exports = Player;
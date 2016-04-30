class Player {

    constructor(phaserGame) {
        this.BG = 'vaca1';
        this.INITIAL_X = 160 * 2;
        this.INITIAL_Y = 160 * 2;
        this.X_SPEED = 100; //px/s
        this.Y_SPEED = 50; //px/s
        this.phaserGame = phaserGame;
        this.createSprite();
    }

    createSprite() {
        this.sprite = this.phaserGame.add.sprite(
                    this.INITIAL_X,
                    this.INITIAL_Y,
                    this.BG);
        this.sprite.anchor.setTo(0.5, 0.99);
    }

    moveTo(pos) {
        var timeToAnimate = this._getTime(pos);
        if (this.tween && this.tween.isRunning) {
            this.tween.stop();
        }
        this.tween = this.phaserGame.add.tween(this.sprite);
        //TODO: cancel last tween
        this.tween.to({ x: pos.x, y: pos.y }, timeToAnimate, 'Linear', true, 0);
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
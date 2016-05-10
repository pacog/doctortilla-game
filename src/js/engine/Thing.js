class Thing {

    constructor(phaserGame, options) {
        this.options = options;
        this.phaserGame = phaserGame;
        this._createSprite();
        
    }

    _createSprite() {

        this.sprite = this.phaserGame.add.sprite(
                        this.options.x,
                        this.options.y,
                        this.options.spriteId
                      );

        this.sprite.inputEnabled = true;

        this.sprite.events.onInputDown.add(this._onClick, this);
        this.sprite.events.onInputOver.add(this._onInputOver, this);
        this.sprite.events.onInputOut.add(this._onInputOut, this);
    }

    _onClick() {
        // console.log('ThingClick');
    }

    _onInputOver() {
        // console.log('_onInputOver');
    }

    _onInputOut() {
        // console.log('_onInputOut');
    }
}

module.exports = Thing;
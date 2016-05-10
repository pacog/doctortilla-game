class Thing {
    constructor(phaserGame) {
        this.phaserGame = phaserGame;
        this.sprite = this.phaserGame.add.sprite(
                        100,
                        161,
                        'door_sprite');

        this.sprite.inputEnabled = true;
        this.sprite.events.onInputDown.add(this._onClick, this);
        this.sprite.events.onInputOver.add(this._onInputOver, this);
        this.sprite.events.onInputOut.add(this._onInputOut, this);
    }

    _onClick() {
        console.log('ThingClick');
    }

    _onInputOver() {
        console.log('_onInputOver');
    }

    _onInputOut() {
        console.log('_onInputOut');
    }
}

module.exports = Thing;
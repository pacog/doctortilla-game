class Player {

    constructor(phaserGame) {
        this.BG = 'ghost1';
        this.posX = 100;
        this.posY = 200;
        this.phaserGame = phaserGame;
        this.createSprite();
    }

    createSprite() {
        var sprite = this.phaserGame.add.sprite(
                    this.posX,
                    this.posY,
                    this.BG);
        sprite.scale.setTo(2, 2);
        sprite.anchor.setTo(0.5, 0.5);
    }
}

module.exports = Player;
class Player {

    constructor(phaserGame) {
        this.BG = 'ghost1';
        this.posX = 460;
        this.posY = 460;
        this.phaserGame = phaserGame;
        this.createSprite();
    }

    createSprite() {
        this.sprite = this.phaserGame.add.sprite(
                    this.posX,
                    this.posY,
                    this.BG);
        this.sprite.scale.setTo(2, 2);
        this.sprite.anchor.setTo(0.5, 0.99);
    }

    moveTo(pos) {
        this.sprite.x = pos.x;
        this.sprite.y = pos.y;
    }
}

module.exports = Player;
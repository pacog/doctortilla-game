class PhaserGame {

    currentValue: Phaser.Game;

    set value(newValue: Phaser.Game) {
        this.currentValue = newValue;
    }

    get value(): Phaser.Game {
        return this.currentValue;
    }
}

export const phaserGame = new PhaserGame();
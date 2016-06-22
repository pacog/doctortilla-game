const SPRITES = {
    'DOCTORTILLA_PLAYER_SPRITE': ['images/player/DOCTORTILLA_PLAYER_SPRITE.png', 44, 61, 21]
};

const IMAGES = {
    'BACKSTAGE_BG': 'images/backstage/BACKSTAGE_BG.png'
};

class AssetsManager {

    loadAssets(game: Phaser.Game):void {
        this.loadImages(game);
        this.loadSprites(game);
    }

    private loadImages(game: Phaser.Game): void {
        for (let imageKey in IMAGES) {
            game.load.image(imageKey, IMAGES[imageKey]);
        }
    }

    private loadSprites(game: Phaser.Game): void {
        for (let spriteKey in SPRITES) {
            game.load.spritesheet(
                spriteKey,
                SPRITES[spriteKey][0],
                SPRITES[spriteKey][1],
                SPRITES[spriteKey][2],
                SPRITES[spriteKey][3]
            );
        }
    }
}

export const assetsManager = new AssetsManager();
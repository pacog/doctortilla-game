const SPRITES = {
    'DOCTORTILLA_PLAYER_SPRITE': ['images/player/DOCTORTILLA_PLAYER_SPRITE.png', 44, 61, 21],
    'BUTTON_BG': ['images/BUTTON_BG_SPRITE.png',75, 18, 3],
    'DOOR_SPRITE': ['images/backstage/DOOR_SPRITE.png', 40, 60, 2]
};

const IMAGES = {
    'UI_BG': 'images/UI_BG.png',
    'UI_INV_BG': 'images/UI_INV_BG.png',
    'BACKSTAGE_BG': 'images/backstage/BACKSTAGE_BG.png',
    'BROOM': 'images/backstage/BROOM.png',
    'BROOM_INV': 'images/backstage/BROOM_INV.png'

};

const FONTS = {
    'FONT_32_BLACK': ['images/fonts/font_32_black.png', 'images/fonts/font_32_black.fnt'],
    'FONT_32_WHITE': ['images/fonts/font_32_white.png', 'images/fonts/font_32_white.fnt'],
    'FONT_32_ORANGE': ['images/fonts/font_32_orange.png', 'images/fonts/font_32_orange.fnt']
};

class AssetsManager {

    loadAssets(game: Phaser.Game): void {
        this.loadImages(game);
        this.loadSprites(game);
        this.loadFonts(game);
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

    private loadFonts(game: Phaser.Game): void {
        for (let fontKey in FONTS) {
            game.load.bitmapFont(
                fontKey,
                FONTS[fontKey][0],
                FONTS[fontKey][1]
            );
        }
    }

}

export const assetsManager = new AssetsManager();

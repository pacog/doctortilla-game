const SPRITES = {
    'DOCTORTILLA_PLAYER_SPRITE': ['images/player/DOCTORTILLA_PLAYER_SPRITE.png', 44, 61, 21],
    'BUTTON_BG': ['images/BUTTON_BG_SPRITE.png',75, 18, 3],
    'DOOR_SPRITE': ['images/backstage/DOOR_SPRITE.png', 40, 60, 2],
    'VENDING_SPRITE': ['images/backstage/VENDING_SPRITE.png', 33, 57, 3],
    'BAND_IN_SOFA_SPRITE': ['images/backstage/BAND_IN_SOFA_SPRITE.png', 111, 79, 9],
    'CONVERSATION_LINE_BG': ['images/CONVERSATION_LINE_BG.png', 529, 20],
    'CABLE_SPRITE': ['images/backstage/CABLE_SPRITE.png', 18, 13, 1]
};

const IMAGES = {
    //General
    'UI_BG': 'images/UI_BG.png',
    'UI_INV_BG': 'images/UI_INV_BG.png',
    'UI_CONVERSATION_BG': 'images/UI_CONVERSATION_BG.png',
    'CONVERSATION_LINE_BG': 'images/CONVERSATION_LINE_BG.png',

    //Backstage scene:
    'BACKSTAGE_BG': 'images/backstage/BACKSTAGE_BG.png',
    'SKIRT': 'images/backstage/SKIRT.png',
    'BROOM': 'images/backstage/BROOM.png',
    'BROOM_INV': 'images/backstage/BROOM_INV.png',
    'BACKYARD_BG': 'images/backyard/BACKYARD_BG.png',
    'CAN_INV': 'images/backstage/CAN_INV.png',
    'COIN_INV': 'images/backstage/COIN_INV.png',
    'COSTUME_SPRITE': 'images/backstage/COSTUME_SPRITE.png',
    'SCISSORS': 'images/backstage/SCISSORS.png',
    'BOCADILLO': 'images/backstage/BOCADILLO.png',
    'BREAD': 'images/backstage/BREAD.png',
    'BACON': 'images/backstage/BACON.png',

    //Backyard:
    'FLOWERS': 'images/backyard/FLOWERS.png'
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

interface IImagesInfo {
    [index : string] : string;
};

interface ISpritesInfo {
    [index : string] : (string|number)[];
};

interface IFontsInfo {
    [index : string] : Array<string>;
};

const SPRITES: ISpritesInfo = {
    // UI
    'BUTTON_BG': ['images/ui/BUTTON_BG_SPRITE.png',75, 18, 3],
    'REFLECT_BUTTON_BG': ['images/ui/REFLECT_BUTTON_BG_SPRITE.png', 75, 56, 3],
    'CONVERSATION_LINE_BG': ['images/ui/CONVERSATION_LINE_BG.png', 508, 20],
    'PAGINATION_BUTTON_UP': ['images/ui/PAGINATION_BUTTON_UP.png', 16, 25, 4],
    'ENGLISH_BUTTON': ['images/ui/ENGLISH_BUTTON.png', 136, 27, 3],
    'SPANISH_BUTTON': ['images/ui/SPANISH_BUTTON.png', 136, 27, 3],

    // PLAYER
    'DOCTORTILLA_PLAYER_SPRITE': ['images/player/DOCTORTILLA_PLAYER_SPRITE.png', 44, 61, 41],
    
    // BACKSTAGE
    'VENDING_MACHINE_SPRITE': ['images/backstage/VENDING_MACHINE_SPRITE.png', 49, 72, 3],
    'BAND_IN_SOFA_SPRITE': ['images/backstage/BAND_IN_SOFA_SPRITE.png', 70, 78, 23],
    'GLASS_INV_SPRITE': ['images/backstage/GLASS_INV_SPRITE.png', 68, 26, 4],
    'COSTUME_INV_SPRITE': ['images/backstage/COSTUME_INV_SPRITE.png', 68, 26, 4],
    'BACKSTAGE_DOOR_TO_BACKYARD_SPRITE': ['images/backstage/BACKSTAGE_DOOR_TO_BACKYARD_SPRITE.png', 61, 104, 2],

    //Backyard
    'BACKYARD_DOOR_TO_BACKSTAGE_SPRITE': ['images/backyard/BACKYARD_DOOR_TO_BACKSTAGE_SPRITE.png', 31, 104, 2],
    'BILI_SPRITE': ['images/backyard/BILI_SPRITE.png', 43, 70, 24],
    'BALLOON_SPRITE': ['images/backyard/BALLOON_SPRITE.png', 28, 59, 10]
};

const IMAGES: IImagesInfo = {
    // UI
    'UI_BG': 'images/ui/UI_BG.png',
    'UI_INV_BG': 'images/ui/UI_INV_BG.png',
    'UI_CONVERSATION_BG': 'images/ui/UI_CONVERSATION_BG.png',
    'LOGO': 'images/ui/LOGO.png',
    'THE_GAME': 'images/ui/THE_GAME.png',
    'CREDITS': 'images/ui/CREDITS.png',

    // Backstage scene:
    'BACKSTAGE_BG': 'images/backstage/BACKSTAGE_BG.png',
    'CABLE': 'images/backstage/CABLE.png',
    'CABLE_INV': 'images/backstage/CABLE_INV.png',
    'SKIRT': 'images/backstage/SKIRT_INV.png',
    'BROOM': 'images/backstage/BROOM.png',
    'BROOM_INV': 'images/backstage/BROOM_INV.png',
    'BACKYARD_BG': 'images/backyard/BACKYARD_BG.png',
    'CAN_INV': 'images/backstage/CAN_INV.png',
    'COIN_INV': 'images/backstage/COIN_INV.png',
    'SCISSORS': 'images/backstage/SCISSORS.png',
    'SCISSORS_INV': 'images/backstage/SCISSORS_INV.png',
    'BOCADILLO': 'images/backstage/BOCADILLO.png',
    'BOCADILLO_INV': 'images/backstage/BOCADILLO_INV.png',
    'BREAD_INV': 'images/backstage/BREAD_INV.png',
    'BACON_INV': 'images/backstage/BACON_INV.png',
    'COCONUT': 'images/backstage/COCONUT.png',
    'COCONUT_INV': 'images/backstage/COCONUT_INV.png',
    'DUST': 'images/backstage/DUST.png',
    'DUST_INV': 'images/backstage/DUST_INV.png',
    'GLASS': 'images/backstage/GLASS.png',
    'LAMP': 'images/backstage/LAMP.png',
    'BACKSTAGE_DOOR_TO_STREET': 'images/backstage/BACKSTAGE_DOOR_TO_STREET.png',
    'BACKSTAGE_DOOR_TO_STAGE': 'images/backstage/BACKSTAGE_DOOR_TO_STAGE.png',
    'FLY_CASE': 'images/backstage/FLY_CASE.png',

    // Backyard:
    'FLOWERS': 'images/backyard/FLOWERS.png',
    'FLOWERS_INV': 'images/backyard/FLOWERS_INV.png',
    'LAMP_BACKYARD': 'images/backyard/LAMP_BACKYARD.png',
    'MOON': 'images/backyard/MOON.png',
    'STAR': 'images/backyard/STAR.png',
    'CUT_FLOWERS': 'images/backyard/CUT_FLOWERS.png'
};

const FONTS: IFontsInfo = {
    'FONT_32_BLACK': ['images/fonts/font_32_black.png', 'images/fonts/font_32_black.fnt'],
    'FONT_32_WHITE': ['images/fonts/font_32_white.png', 'images/fonts/font_32_white.fnt'],
    'FONT_32_ORANGE': ['images/fonts/font_32_orange.png', 'images/fonts/font_32_orange.fnt'],
    'FONT_32_BLUE': ['images/fonts/font_32_blue.png', 'images/fonts/font_32_blue.fnt'],
    'FONT_32_RED': ['images/fonts/font_32_red.png', 'images/fonts/font_32_red.fnt'],
    'FONT_32_YELLOW': ['images/fonts/font_32_yellow.png', 'images/fonts/font_32_yellow.fnt'],
    'FONT_32_PURPLE': ['images/fonts/font_32_purple.png', 'images/fonts/font_32_purple.fnt']
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
                <string> SPRITES[spriteKey][0],
                <number> SPRITES[spriteKey][1],
                <number> SPRITES[spriteKey][2],
                <number> SPRITES[spriteKey][3]
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

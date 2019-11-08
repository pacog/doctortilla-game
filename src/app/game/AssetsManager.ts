const IMAGES_ROOT = 'assets/images/'
const SOUNDS_ROOT = 'assets/sounds/'

interface IImagesInfo {
    [index : string] : string;
};

interface IAudioInfo {
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
    'BUTTON_BG': [IMAGES_ROOT + 'ui/BUTTON_BG_SPRITE.png',75, 18, 3],
    'REFLECT_BUTTON_BG': [IMAGES_ROOT + 'ui/REFLECT_BUTTON_BG_SPRITE.png', 75, 56, 3],
    'CONVERSATION_LINE_BG': [IMAGES_ROOT + 'ui/CONVERSATION_LINE_BG.png', 508, 20],
    'PAGINATION_BUTTON_UP': [IMAGES_ROOT + 'ui/PAGINATION_BUTTON_UP.png', 16, 25, 4],
    'ENGLISH_BUTTON': [IMAGES_ROOT + 'ui/ENGLISH_BUTTON.png', 136, 27, 3],
    'SPANISH_BUTTON': [IMAGES_ROOT + 'ui/SPANISH_BUTTON.png', 136, 27, 3],
    'ENABLE_BUTTON_BG': [IMAGES_ROOT + 'ui/ENABLE_SOUND_BUTTON.png', 36, 36, 3],
    'DISABLE_BUTTON_BG': [IMAGES_ROOT + 'ui/DISABLE_SOUND_BUTTON.png', 36, 36, 3],

    // PLAYER
    'DOCTORTILLA_PLAYER_SPRITE': [IMAGES_ROOT + 'player/DOCTORTILLA_PLAYER_SPRITE.png', 44, 61, 41],
    
    // BACKSTAGE
    'VENDING_MACHINE_SPRITE': [IMAGES_ROOT + 'backstage/VENDING_MACHINE_SPRITE.png', 49, 72, 3],
    'BAND_IN_SOFA_SPRITE': [IMAGES_ROOT + 'backstage/BAND_IN_SOFA_SPRITE.png', 70, 78, 23],
    'GLASS_INV_SPRITE': [IMAGES_ROOT + 'backstage/GLASS_INV_SPRITE.png', 68, 26, 4],
    'COSTUME_INV_SPRITE': [IMAGES_ROOT + 'backstage/COSTUME_INV_SPRITE.png', 68, 26, 4],
    'BACKSTAGE_DOOR_TO_BACKYARD_SPRITE': [IMAGES_ROOT + 'backstage/BACKSTAGE_DOOR_TO_BACKYARD_SPRITE.png', 61, 104, 2],

    //Backyard
    'BACKYARD_DOOR_TO_BACKSTAGE_SPRITE': [IMAGES_ROOT + 'backyard/BACKYARD_DOOR_TO_BACKSTAGE_SPRITE.png', 31, 104, 2],
    'BACKSTAGE_DOOR_TO_STAGE_SPRITE': [IMAGES_ROOT + 'backstage/BACKSTAGE_DOOR_TO_STAGE.png', 89, 84, 2],
    'BILI_SPRITE': [IMAGES_ROOT + 'backyard/BILI_SPRITE.png', 43, 70, 24],
    'BALLOON_SPRITE': [IMAGES_ROOT + 'backyard/BALLOON_SPRITE.png', 28, 59, 10],

    //Kitchen
    'STAGE_DOOR_TO_BACKSTAGE_SPRITE': [IMAGES_ROOT + 'kitchen/STAGE_DOOR_TO_BACKSTAGE.png', 28, 117, 2],
    'TAP_SPRITE': [IMAGES_ROOT + 'kitchen/TAP.png', 37, 16, 2],
    'STAGE_TO_OUTSIDE_DOOR_SPRITE': [IMAGES_ROOT + 'kitchen/STAGE_OUTSIDE_DOOR.png', 30, 117, 2],
    'FRIDGE_SPRITE': [IMAGES_ROOT + 'kitchen/FRIDGE.png', 85, 107, 2],
};

const IMAGES: IImagesInfo = {
    // UI
    'UI_BG': IMAGES_ROOT + 'ui/UI_BG.png',
    'UI_INV_BG': IMAGES_ROOT + 'ui/UI_INV_BG.png',
    'UI_CONVERSATION_BG': IMAGES_ROOT + 'ui/UI_CONVERSATION_BG.png',
    'LOGO': IMAGES_ROOT + 'ui/LOGO.png',
    'THE_GAME': IMAGES_ROOT + 'ui/THE_GAME.png',
    'CREDITS': IMAGES_ROOT + 'ui/CREDITS.png',

    // Backstage scene:
    'BACKSTAGE_BG': IMAGES_ROOT + 'backstage/BACKSTAGE_BG.png',
    'CABLE': IMAGES_ROOT + 'backstage/CABLE.png',
    'CABLE_INV': IMAGES_ROOT + 'backstage/CABLE_INV.png',
    'SKIRT': IMAGES_ROOT + 'backstage/SKIRT_INV.png',
    'BROOM': IMAGES_ROOT + 'backstage/BROOM.png',
    'BROOM_INV': IMAGES_ROOT + 'backstage/BROOM_INV.png',
    'BACKYARD_BG': IMAGES_ROOT + 'backyard/BACKYARD_BG.png',
    'CAN_INV': IMAGES_ROOT + 'backstage/CAN_INV.png',
    'COIN_INV': IMAGES_ROOT + 'backstage/COIN_INV.png',
    'SCISSORS': IMAGES_ROOT + 'backstage/SCISSORS.png',
    'SCISSORS_INV': IMAGES_ROOT + 'backstage/SCISSORS_INV.png',
    'BOCADILLO': IMAGES_ROOT + 'backstage/BOCADILLO.png',
    'BOCADILLO_INV': IMAGES_ROOT + 'backstage/BOCADILLO_INV.png',
    'BREAD_INV': IMAGES_ROOT + 'backstage/BREAD_INV.png',
    'BACON_INV': IMAGES_ROOT + 'backstage/BACON_INV.png',
    'COCONUT': IMAGES_ROOT + 'backstage/COCONUT.png',
    'COCONUT_INV': IMAGES_ROOT + 'backstage/COCONUT_INV.png',
    'DUST': IMAGES_ROOT + 'backstage/DUST.png',
    'DUST_INV': IMAGES_ROOT + 'backstage/DUST_INV.png',
    'GLASS': IMAGES_ROOT + 'backstage/GLASS.png',
    'LAMP': IMAGES_ROOT + 'backstage/LAMP.png',
    'BACKSTAGE_DOOR_TO_STREET': IMAGES_ROOT + 'backstage/BACKSTAGE_DOOR_TO_STREET.png',
    'FLY_CASE': IMAGES_ROOT + 'backstage/FLY_CASE.png',

    // Backyard:
    'FLOWERS': IMAGES_ROOT + 'backyard/FLOWERS.png',
    'FLOWERS_INV': IMAGES_ROOT + 'backyard/FLOWERS_INV.png',
    'LAMP_BACKYARD': IMAGES_ROOT + 'backyard/LAMP_BACKYARD.png',
    'MOON': IMAGES_ROOT + 'backyard/MOON.png',
    'STAR': IMAGES_ROOT + 'backyard/STAR.png',
    'CUT_FLOWERS': IMAGES_ROOT + 'backyard/CUT_FLOWERS.png',

    // Kitchen
    'KITCHEN_BG': IMAGES_ROOT + 'kitchen/KITCHEN_BG.png',
    'CREEPY_STAINS': IMAGES_ROOT + 'kitchen/MANCHAS_CHUNGAS.png',
    'FLASHLIGHT': IMAGES_ROOT + 'kitchen/FLASHLIGHT.png',
    'FLASHLIGHT_INV': IMAGES_ROOT + 'kitchen/FLASHLIGHT_INV.png'
};

const FONTS: IFontsInfo = {
    'FONT_32_BLACK': [IMAGES_ROOT + 'fonts/font_32_black.png', IMAGES_ROOT + 'fonts/font_32_black.fnt'],
    'FONT_32_WHITE': [IMAGES_ROOT + 'fonts/font_32_white.png', IMAGES_ROOT + 'fonts/font_32_white.fnt'],
    'FONT_32_ORANGE': [IMAGES_ROOT + 'fonts/font_32_orange.png', IMAGES_ROOT + 'fonts/font_32_orange.fnt'],
    'FONT_32_BLUE': [IMAGES_ROOT + 'fonts/font_32_blue.png', IMAGES_ROOT + 'fonts/font_32_blue.fnt'],
    'FONT_32_RED': [IMAGES_ROOT + 'fonts/font_32_red.png', IMAGES_ROOT + 'fonts/font_32_red.fnt'],
    'FONT_32_YELLOW': [IMAGES_ROOT + 'fonts/font_32_yellow.png', IMAGES_ROOT + 'fonts/font_32_yellow.fnt'],
    'FONT_32_PURPLE': [IMAGES_ROOT + 'fonts/font_32_purple.png', IMAGES_ROOT + 'fonts/font_32_purple.fnt']
};

const AUDIO: IAudioInfo = {
    'SUBETE': SOUNDS_ROOT + 'subete_el_midi.ogg',
    'ALLI_DONDE': SOUNDS_ROOT + 'alli_donde_game.ogg'
};

class AssetsManager {

    loadAssets(game: Phaser.Game): void {
        this.loadImages(game);
        this.loadSprites(game);
        this.loadFonts(game);
        this.loadSounds(game);
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

    private loadSounds(game: Phaser.Game): void {
        for (let soundKey in AUDIO) {
            game.load.audio(soundKey, AUDIO[soundKey]);
        }
    }

}

export const assetsManager = new AssetsManager();

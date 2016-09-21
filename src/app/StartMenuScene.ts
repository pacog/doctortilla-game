import { layout } from './engine/ui/LayoutManager.singleton';
import { phaser } from './Phaser';
import { labelsStore } from './engine/stores/Labels.store';
import { analytics } from './engine/utils/analytics';

export const StartMenuScene = {
    preload: function() {},

    create: function () {
        this.createLogo();
        this.createButtons();
    },

    createLogo: function() {
        let logo : Phaser.Sprite = this.game.add.sprite(layout.LOGO_POSITION.x, layout.LOGO_POSITION.y - 30, 'LOGO');
        let logoTween : Phaser.Tween = this.game.add.tween(logo);

        logoTween.to({ y: layout.LOGO_POSITION.y }, 1000, 'Elastic', true, 0);

        let theGame: Phaser.Sprite = this.game.add.sprite(layout.THE_GAME_POSITION.x, layout.THE_GAME_POSITION.y, 'THE_GAME');
        let theGameTween : Phaser.Tween = this.game.add.tween(theGame);
        theGame.alpha = 0;
        theGameTween.to({ alpha: 1 }, 1000, 'Linear', true, 0);

    },

    createButtons: function() {
        this.createEnglishButton();
        this.createSpanishButton();
    },

    createEnglishButton: function() {
        var englishButton : Phaser.Button = this.game.add.button(
            layout.ENGLISH_BUTTON_POSITION.x,
            layout.ENGLISH_BUTTON_POSITION.y,
            'ENGLISH_BUTTON',
            this.onEnglishButtonClick,
            this,
            1,
            0,
            2,
            1
        );
        englishButton.fixedToCamera = true;
    },

    createSpanishButton: function() {
        var spanishButton : Phaser.Button = this.game.add.button(
            layout.SPANISH_BUTTON_POSITION.x,
            layout.SPANISH_BUTTON_POSITION.y,
            'SPANISH_BUTTON',
            this.onSpanishButtonClick,
            this,
            1,
            0,
            2,
            1
        );
        spanishButton.fixedToCamera = true;
    },

    onEnglishButtonClick: function() {
        analytics.sendEvent('start_menu', 'select_language', 'english');
        analytics.sendEvent('game', 'start_game');
        labelsStore.setLanguage('en');
        this.game.state.start('play');
    },

    onSpanishButtonClick: function() {
        analytics.sendEvent('start_menu', 'select_language', 'spanish');
        analytics.sendEvent('game', 'start_game');
        labelsStore.setLanguage('es');
        this.game.state.start('play');
    }
};
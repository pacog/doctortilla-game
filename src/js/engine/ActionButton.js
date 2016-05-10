const DEFAULT_BUTTON_POSITION = {x: 0, y: 0};
const DEFAULT_BUTTON_HEIGHT = 30;
const DEFAULT_BUTTON_WIDTH = 100;
const DEFAULT_FONT_SIZE = 14;

class ActionButton {

    constructor(phaserGame, label, position) {
        this.phaserGame = phaserGame;
        position = position || DEFAULT_BUTTON_POSITION;

        let button = this.phaserGame.add.button(
            position.x,
            position.y,
            'buttons_BG',
            this.onClick,
            this,
            1,
            0,
            2,
            3
        );

        button.onInputOver.add(this.onOver, this);
        button.onInputOut.add(this.onOut, this);
        button.onInputUp.add(this.onUp, this);

        this.text = this.phaserGame.add.bitmapText(
            position.x + DEFAULT_BUTTON_WIDTH / 2,
            position.y + DEFAULT_BUTTON_HEIGHT / 2,
            'font_1',
            label,
            DEFAULT_FONT_SIZE
        );
        this.text.anchor.setTo(0.5, 0.5);

    }

    onClick() {
        console.log('on click');
    }

    onOut() {
        console.log('on onOut');
    }

    onUp() {
        console.log('on onUp');
    }

    onOver() {
        console.log('on onOver');
    }

}

module.exports = ActionButton;
/* global Promise */
var style = require('./Style.singleton.js');

const DEFAULT_TEXT_OPTIONS = Object.freeze({
    timePerLetter: 50,
    minDestroyTime: 2000,
    text: '',
    position: { x: 100, y: 100},
    width: 30,
    autoDestroy: false,
    anchor: { x: 0, y: 0}
});

class Text {

    constructor(phaserGame, options = {}) {
        this.phaserGame = phaserGame;
        this.options = Object.assign({}, DEFAULT_TEXT_OPTIONS, options);
        this._createText();
        if (this.options.autoDestroy) {
            this.promise = this._autoDestroy();
        }
    }

    _createText() {
        let textInLines = this._separateTextIntoLines(this.options.text, this.options.width);
        let positionX = this._getXPositionForText(textInLines);
        let positionY = this._getYPositionForText(textInLines);

        this.shadowText = this.phaserGame.add.bitmapText(
            style.FONT_SHADOW_X + positionX,
            style.FONT_SHADOW_Y + positionY,
            'font_32_black',
            textInLines,
            style.DEFAULT_FONT_SIZE
        );
        this.shadowText.align = 'center';
        this.shadowText.anchor.setTo(this.options.anchor.x, this.options.anchor.y);

        this.text = this.phaserGame.add.bitmapText(
            positionX,
            positionY,
            'font_32_white',
            textInLines,
            style.DEFAULT_FONT_SIZE
        );
        this.text.align = 'center';
        this.text.anchor.setTo(this.options.anchor.x, this.options.anchor.y);
    }

    _separateTextIntoLines(text = '', maxLength = 20) {

        let words = text.split(' ');
        let lines = [''];
        let currentLine = 0;

        for (let i = 0; i < words.length; i++) {
            //If a word is too big for this line, add to next
            if ((lines[currentLine].length + words[i].length) >= maxLength) {
                lines.push('' + words[i]);
                currentLine ++;
            } else {
                lines[currentLine] += ' ' + words[i];
            }
        }
        return lines.join('\n');
    }

    _getXPositionForText(text = '') {
        let longestLine = this._getLongestLine(text);
        let maxWidth = longestLine * style.DEFAULT_FONT_SIZE;

        return this.options.position.x - (maxWidth / 2);
    }

    _getYPositionForText(text = '') {
        let lines = text.split('\n').length;
        let totalHeight = lines * style.DEFAULT_FONT_SIZE;
        return this.options.position.y - totalHeight;
    }

    _getLongestLine(text = '') {
        let lines = text.split('\n');
        let maxLength = 0;
        for (let i = 0; i < lines.length; i++) {
            maxLength = Math.max(maxLength, lines[i].length);
        }
        return maxLength;
    }

    _autoDestroy() {
        let deferred = new Promise((resolveCallback) => {
            this.resolveCallback = resolveCallback;
        });
        let timeToDestroy = this._getTimeToDestroyFromText(this.options.text);
        this._timeoutToDestroy = setTimeout(() => this.destroy(), timeToDestroy);
        return deferred;
    }

    _getTimeToDestroyFromText(text = '') {
        let timeToDestroy = this.options.timePerLetter * text.length;
        return Math.max(this.options.minDestroyTime, timeToDestroy);
    }

    destroy() {
        if (this.text) {
            this.text.destroy();
            this.text = null;
        }
        if (this.shadowText) {
            this.shadowText.destroy();
            this.shadowText = null;
        }
        if (this.resolveCallback) {
            this.resolveCallback();
            this.resolveCallback = null;
        }
    }

}

module.exports = Text;
var layout = require('./LayoutManager.singleton.js');
var style = require('./Style.singleton.js');

class UIConversationLine {
    constructor(phaserGame, conversationLine, index) {
        if (!phaserGame) {
            throw 'ERROR: conversation line UI, no phaserGame provided';
        }
        if (!conversationLine) {
            throw 'ERROR: conversation line UI, no conversationLine provided';
        }
        if (typeof index !== 'number') {
            throw 'ERROR: conversation line UI, no index provided';
        }
        this.phaserGame = phaserGame;
        this.conversationLine = conversationLine;
        this.index = index;
        this._onClickSubscribers = new Set();
        this._position = layout.getPositionForConversationLine(this.index);
        this._createButton();
        this._createText();
    }

    _createButton() {
        
        this.button = this.phaserGame.add.button(
            this._position.x,
            this._position.y,
            'CONVERSATION_LINE_BG',
            this._onClick,
            this,
            1,
            0,
            2,
            1
        );
        this.button.fixedToCamera = true;
    }

    _createText() {
        let text = this.conversationLine.text();
        this.shadowText = this.phaserGame.add.bitmapText(
            1 + this._position.x + layout.CONVERSATION_LINE_PADDING_X,
            1 + this._position.y + layout.CONVERSATION_LINE_PADDING_Y,
            'font_32_black',
            text,
            style.DEFAULT_FONT_SIZE
        );
        this.shadowText.anchor.setTo(0, 0);
        this.shadowText.fixedToCamera = true;

        this.text = this.phaserGame.add.bitmapText(
            this._position.x + layout.CONVERSATION_LINE_PADDING_X,
            this._position.y + layout.CONVERSATION_LINE_PADDING_Y,
            'font_32_white',
            text,
            style.DEFAULT_FONT_SIZE
        );
        this.text.anchor.setTo(0, 0);
        this.text.fixedToCamera = true;
    }

    _onClick() {
        this._onClickSubscribers.forEach(callback => callback(this.conversationLine));
    }

    subscribeToClick(callback) {
        this._onClickSubscribers.add(callback);
    }

    destroy() {
        this.button.destroy();
        this.text.destroy();
        this.shadowText.destroy();
    }
}

module.exports = UIConversationLine;
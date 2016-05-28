var layout = require('./LayoutManager.singleton.js');
var UIConversationLine = require('./UIConversationLine.js');
var uiBlocker = require('./UIBlocker.singleton.js');

class UIConversation {

    constructor(phaserGame, conversation) {
        this.phaserGame = phaserGame;
        this.conversation = conversation
        uiBlocker.block(this.phaserGame);
        this._createBackground();
        this.conversation.onStateChange((newState) => this._update(newState));
    }

    _createBackground() {
        let layoutStartPosition = layout.UI_START_POSITION;

        this.background = this.phaserGame.add.sprite(
                    layoutStartPosition.x,
                    layoutStartPosition.y,
                    'UI_CONVERSATION_BG');
        this.background.anchor.setTo(0, 0);
        this.background.fixedToCamera = true;

        this.background.inputEnabled = true;

    }

    _update() {
        this._destroyOldLines();
        this._createNewLines();
    }

    _createNewLines() {
        let newLines = this.conversation.getLines();
        newLines.forEach((newLine, index) => this._createLine(newLine, index));
    }

    _createLine(line, index) {
        let newUILine = new UIConversationLine(
            this.phaserGame,
            line,
            this.conversation.getTextForLine(line),
            index);
        newUILine.subscribeToClick(lineClicked => this._lineClicked(lineClicked));
        this.lines.push(newUILine);
    }

    _lineClicked(line) {
        this._destroyOldLines();
        this.conversation.applyLine(line);
    }

    _destroyOldLines() {
        if (this.lines && this.lines.forEach) {
            this.lines.forEach(line => line.destroy());
        }
        this.lines = [];
    }

    destroy() {
        this._destroyOldLines();
        this.background.destroy();
        uiBlocker.unblock();
    }

}

module.exports = UIConversation;
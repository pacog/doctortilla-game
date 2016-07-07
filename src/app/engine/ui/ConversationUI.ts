import { layout } from './LayoutManager.singleton';
import { uiBlocker } from '../../engine/ui/UIBlocker.singleton';
import { Conversation } from '../models/Conversation';
import { ConversationLine } from '../models/ConversationLine';
import { ConversationLineUI } from './ConversationLineUI';
import { uiLayers } from './UILayers.singleton';

export class ConversationUI {

    private background: Phaser.Sprite;
    private lines: Array<ConversationLineUI>;

    constructor(private conversation: Conversation) {
        uiBlocker.block();
        this.lines = [];
        this.createBackground();
        this.conversation.onStateChange((newState) => this.update(newState));
    }

    destroy(): void {
        this.destroyOldLines();
        this.background.destroy();
        uiBlocker.unblock();
    }

    private createBackground(): void {
        let layoutStartPosition = layout.UI_START_POSITION;

        this.background = uiLayers.conversation.create(
            layoutStartPosition.x,
            layoutStartPosition.y,
            'UI_CONVERSATION_BG'
        );
        this.background.anchor.setTo(0, 0);
        this.background.fixedToCamera = true;

        this.background.inputEnabled = true;
    }

    private update(newState: string): void {
        this.destroyOldLines();
        this.createNewLines();
    }

    private createNewLines(): void {
        let newLines = this.conversation.getLines();
        newLines.forEach((newLine, index) => this.createLine(newLine, index));
    }

    private createLine(line, index): void {
        let newUILine = new ConversationLineUI(
            line,
            this.conversation.getTextForLine(line),
            index);
        newUILine.subscribeToClick(clickedLined => this.lineClicked(clickedLined));
        this.lines.push(newUILine);
    }

    private lineClicked(line: ConversationLine) {
        this.destroyOldLines();
        this.conversation.applyLine(line);
    }

    private destroyOldLines(): void {
        this.lines.forEach(line => line.destroy());
        this.lines = [];
    }

    
}

import { layout } from './LayoutManager.singleton';
import { uiBlocker } from '../../engine/ui/UIBlocker.singleton';
import { Conversation } from '../models/Conversation';
import { ConversationLine } from '../models/ConversationLine';
import { ConversationLineUI } from './ConversationLineUI';
import { uiLayers } from './UILayers.singleton';
import { PaginationButtonType, InventoryPaginationButton } from './InventoryPaginationButton';

const LINES_PER_PAGE = 3;

export class ConversationUI {

    private background: Phaser.Sprite;
    private lines: Array<ConversationLineUI>;
    private uiBlockerWasBlockedBefore: Boolean;
    private firstLineShown: number;
    private paginationButtonUp: InventoryPaginationButton;
    private paginationButtonDown: InventoryPaginationButton;

    constructor(private conversation: Conversation) {
        this.firstLineShown = 0;
        this.uiBlockerWasBlockedBefore = uiBlocker.isBlocked();
        uiBlocker.block();
        this.lines = [];
        this.createBackground();
        this.conversation.onStateChange((newState) => this.update(newState));
    }

    destroy(): void {
        this.destroyOldLines();
        this.background.destroy();
        if(!this.uiBlockerWasBlockedBefore) {
            uiBlocker.unblock();
        }
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
        this.firstLineShown = 0;
        this.destroyOldLines();
        this.createNewLines();
    }

    private createNewLines(): void {
        let newLines = this.conversation.getLines();
        for(let i=this.firstLineShown; i<(this.firstLineShown + LINES_PER_PAGE) && (i<newLines.length); i++) {
            this.createLine(newLines[i], i - this.firstLineShown);
        }
        this.createPaginationButtons();
    }

    private createLine(line: ConversationLine, index: number): void {
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
        this.destroyPaginationButtons();
    }

    private createPaginationButtons(): void {
        this.destroyPaginationButtons();
        if(this.firstLineShown > 0) {
            this.paginationButtonUp = new InventoryPaginationButton({
                type: PaginationButtonType.UP,
                layer: uiLayers.conversation
            });
            this.paginationButtonUp.subscribeToClick(() => {
                this.goToPrevPage();
            });
        }
        if((this.firstLineShown + LINES_PER_PAGE) < this.conversation.getLines().length) {
            this.paginationButtonDown = new InventoryPaginationButton({
                type: PaginationButtonType.DOWN,
                layer: uiLayers.conversation
            });
            this.paginationButtonDown.subscribeToClick(() => {
                this.goToNextPage();
            });
        }
    }

    private goToPrevPage(): void {
        this.firstLineShown--;
        this.destroyOldLines();
        this.createNewLines();
    }

    private goToNextPage(): void {
        this.firstLineShown++;
        this.destroyOldLines();
        this.createNewLines();
    }

    private destroyPaginationButtons(): void {
        if(this.paginationButtonUp) {
            this.paginationButtonUp.destroy();
            this.paginationButtonUp = null;
        }

        if(this.paginationButtonDown) {
            this.paginationButtonDown.destroy();
            this.paginationButtonDown = null;
        }
    }

    
}

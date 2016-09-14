import { layout } from './LayoutManager.singleton';
import { style } from './Style';
import { ConversationLine } from '../models/ConversationLine';
import { Observable, ICallback } from '../utils/Observable';
import { IPoint } from '../utils/Interfaces';
import { phaserGame } from '../state/PhaserGame.singleton';
import { uiLayers } from './UILayers.singleton';
import { TextWithShadow } from './TextWithShadow';
import { label } from '../stores/Labels.store';

export class ConversationLineUI {

    private clickObservable: Observable;
    private position: IPoint;
    private button: Phaser.Button;
    private text: TextWithShadow;

    constructor(
        private conversationLine: ConversationLine,
        private lineText: string,
        private index: number) {

        if (!this.conversationLine) {
            throw 'ERROR: conversation line UI, no conversationLine provided';
        }
        if (!this.lineText) {
            throw 'ERROR: conversation line UI, no text provided';
        }
        if (typeof this.index !== 'number') {
            throw 'ERROR: conversation line UI, no index provided';
        }

        this.clickObservable = new Observable();
        this.position = layout.getPositionForConversationLine(this.index);
        this.createButton();
        this.createText();
    }

    subscribeToClick(callback: ICallback): void {
        this.clickObservable.registerObserver(callback);
    }

    destroy() {
        this.button.destroy();
        this.text.destroy();
    }

    private createButton(): void {
        this.button = phaserGame.value.add.button(
            this.position.x,
            this.position.y,
            'CONVERSATION_LINE_BG',
            this.onClick,
            this,
            1,
            0,
            2,
            1
        );
        uiLayers.conversation.add(this.button);
        this.button.fixedToCamera = true;
    }

    private createText(): void {
        let position = {
            x: this.position.x + layout.CONVERSATION_LINE_PADDING_X,
            y: this.position.y + layout.CONVERSATION_LINE_PADDING_Y
        };
        this.text = new TextWithShadow({
            initialText: label(this.lineText),
            position: position,
            fixedToCamera: true,
            layer: uiLayers.conversation
        });
    }

    private onClick(): void {
        this.clickObservable.notifyObservers(this.conversationLine);
    }

}
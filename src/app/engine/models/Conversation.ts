import { Player } from './Player';
import { Thing } from './Thing';
import { Observable, ICallback } from '../utils/Observable';
import { ConversationLine } from './ConversationLine';
import { ConversationUI } from '../ui/ConversationUI';

export interface IConversationScript { [s: string]: Array<ConversationLine>; }

export abstract class Conversation {

    private onChangeObservable: Observable;
    private _stateId: string;
    protected script: IConversationScript;
    private ui: ConversationUI;

    constructor(protected player: Player, protected otherPerson: Thing) {
        this.player = player;
        this.otherPerson = otherPerson;
        this.loadScript();
        this.onChangeObservable = new Observable();
        this.initState();
        this.createConversationUI();
    }

    onStateChange(callback: ICallback): void {
        this.onChangeObservable.registerObserver(callback);
        callback(this.state);
    }

    get state(): string {
        return this._stateId;
    }

    getLines(): Array<ConversationLine> {
        let currentState = this.state;
        if (!this.script || !this.script[currentState]) {
            throw 'ERROR, there are no lines for this state of conversation';
        }
        return this.script[currentState];
    }

    set state(newState) {
        if (newState === 'end') {
            this.ui.destroy();
        } else {
            this._stateId = newState;
            this.loadScript();
            this.notifyStateChange();
        }
    }

    applyLine(line: ConversationLine): void {
        line.afterCallback(this.player, this.otherPerson)
            .then(() => {
                this.state = line.nextState;
            });
    }

    getTextForLine(line: ConversationLine): string {
        var textCallback = line.text;
        return textCallback({});
    }

    protected abstract loadScript(): void;
    protected abstract initState(): void;

    private createConversationUI(): void {
        this.ui = new ConversationUI(this);
    }

    private notifyStateChange(): void {
        this.onChangeObservable.notifyObservers(this.state);
    }

}

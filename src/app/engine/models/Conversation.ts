// var UIConversation = require('../ui/UIConversation.js');
import { Player } from './Player';
import { Thing } from './Thing';
import { Observable, ICallback } from '../utils/Observable';
import { ConversationLine } from './ConversationLine';

export interface IConversationScript { [s: string]: Array<ConversationLine>; }

export abstract class Conversation {

    private onChangeObservable: Observable;
    private _stateId: string;
    protected script: IConversationScript;

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
            //TODO
            // this.ui.destroy();
        } else {
            this._stateId = newState;
            this.loadScript();
            this.notifyStateChange();
        }
    }

    applyLine(line) {
        line.afterCallback(this.player, this.otherPerson)
            .then(() => {
                this.state = line.nextState;
            });
    }

    getTextForLine(line) {
        return line.text();
    }

    protected abstract loadScript(): void;
    protected abstract initState(): void;

    private createConversationUI(): void {
        //TODO
        // this.ui = new UIConversation(this.phaserGame, this);
    }

    private notifyStateChange(): void {
        this.onChangeObservable.notifyObservers(this.state);
    }

}

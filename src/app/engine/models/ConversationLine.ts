import { Player } from './Player';
import { Thing } from './Thing';
import { ICallback } from '../Utils/Observable';

export interface IConversationCallback {
    (player: Player, otherPerson: Thing): any;
}

const emptyFunctionWithPromise = function () {
    var result = {
        resolveCallback: function() {}
    };
    let deferred = new Promise(function (resolve) {
        result.resolveCallback = resolve;
    });
    result.resolveCallback();

    return deferred;
};

export class ConversationLine {

    constructor(private _text: string | IConversationCallback,
                private _nextState: string | (() => string),
                private _afterCallback: IConversationCallback = emptyFunctionWithPromise) {

        if (!this._text) {
            throw 'ERROR: missing text for conversation line';
        }
        if (!this._nextState) {
            throw 'ERROR: missing next state for conversation line';
        }
    }

    get text(): ICallback {
        if (typeof this._text === 'string') {
            return (() => {return this._text; });
        } else if (typeof this._text === 'function') {
            return <ICallback> this._text;
        }
        throw 'ERROR: getting text of conversation line, with incorrect type';
    }

    get afterCallback(): IConversationCallback {
        return this._afterCallback;
    }

    get nextState(): string {
        return this.getNextState();
    }

    private getNextState(): string {
        if (typeof this._nextState === 'string') {
            return <string> this._nextState;
        } else {
            return (<(() => string)> this._nextState)();
        }
    }
}

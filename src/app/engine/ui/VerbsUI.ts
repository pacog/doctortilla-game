import { Verbs } from '../stores/Verbs.store';
import { ActionButton } from './ActionButton';

export class VerbsUI {

    private buttons: Map<Verbs, ActionButton>;

    constructor() {
        this.createButtons();
        this.listenToEvents();
    }

    private createButtons(): void {
        this.buttons = new Map();
        this.buttons.set(
                Verbs.GO_TO,
                new ActionButton(
                    Verbs.GO_TO,
                    {x: 0, y: 0}
                )
            );
        this.buttons.set(
                Verbs.LOOK,
                new ActionButton(
                    Verbs.LOOK,
                    {x: 0, y: 1}
                )
            );
        this.buttons.set(
                Verbs.GIVE,
                new ActionButton(
                    Verbs.GIVE,
                    {x: 0, y: 2}
                )
            );
        this.buttons.set(
                Verbs.PUSH,
                new ActionButton(
                    Verbs.PUSH,
                    {x: 1, y: 0}
                )
            );
        this.buttons.set(
                Verbs.TAKE,
                new ActionButton(
                    Verbs.TAKE,
                    {x: 1, y: 1}
                )
            );
        this.buttons.set(
                Verbs.USE,
                new ActionButton(
                    Verbs.USE,
                {x: 1, y: 2}
                )
            );
        this.buttons.set(
                Verbs.SPEAK,
                new ActionButton(
                    Verbs.SPEAK,
                    {x: 2, y: 0}
                )
            );
        this.buttons.set(
                Verbs.OPEN,
                new ActionButton(
                    Verbs.OPEN,
                    {x: 2, y: 1}
                )
            );
        this.buttons.set(
                Verbs.CLOSE,
                new ActionButton(
                    Verbs.CLOSE,
                    {x: 2, y: 2}
                )
            );
    }

    private listenToEvents(): void  {}
}


    // _listenToEvents() {
    //     actionDispatcher.subscribeTo(
    //         actions.CURSOR_OVER_THING,
    //         (thing) => this._highlightSecondaryActionForThing(thing)
    //     );

    //     actionDispatcher.subscribeTo(
    //         actions.CURSOR_OUT_THING,
    //         () => this._removePreviouslyHighlightedAction()
    //     );
    // }

    // _highlightSecondaryActionForThing(thing) {
    //     this._removePreviouslyHighlightedAction();
    //     this._highlightedAction = thing.getPreferredAction();
    //     if (this._highlightedAction) {
    //         this.buttons.get(this._highlightedAction).highlight();
    //     }
    // }

    // _removePreviouslyHighlightedAction() {
    //     if (this._highlightedAction) {
    //         this.buttons.get(this._highlightedAction).unhighlight();
    //         this._highlightedAction = null;
    //     }
    // }

    
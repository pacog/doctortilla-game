import { Verbs } from '../stores/Verbs.store';
import { ActionButton } from './ActionButton';
import { actionDispatcher, Actions } from '../utils/ActionDispatcher';
import { Thing } from '../models/Thing';

export class VerbsUI {

    private buttons: Map<Verbs, ActionButton>;
    private highlightedAction: Verbs;

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

    private listenToEvents(): void  {
        actionDispatcher.subscribeTo(
            Actions.CURSOR_OVER_THING,
            (thing) => this.highlightSecondaryActionForThing(thing)
        );

        actionDispatcher.subscribeTo(
            Actions.CURSOR_OUT_THING,
            () => this.removePreviouslyHighlightedAction()
        );

        actionDispatcher.subscribeTo(
            Actions.ACTION_APPLIED,
            () => this.removePreviouslyHighlightedAction()
        );
    }

    private highlightSecondaryActionForThing(thing: Thing) : void{
        this.removePreviouslyHighlightedAction();
        this.highlightedAction = thing.getPreferredAction();
        if (this.highlightedAction) {
            this.buttons.get(this.highlightedAction).highlight();
        }
    }

    private removePreviouslyHighlightedAction(): void {
        if (this.highlightedAction) {
            this.buttons.get(this.highlightedAction).unhighlight();
            this.highlightedAction = null;
        }
    }
}

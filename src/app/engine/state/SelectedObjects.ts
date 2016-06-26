import { actionDispatcher, Actions } from '../utils/ActionDispatcher';
import { GenericHighlightedThing } from '../models/GenericHighlightedThing';
import { Thing } from '../models/Thing';
import { selectedVerb } from './SelectedVerb.singleton';
import { VerbsInfo } from '../stores/Verbs.store';

class SelectedThing extends GenericHighlightedThing {
    constructor() {
        super();
        actionDispatcher.subscribeTo(
            Actions.ACTION_APPLIED,
            () => this.highlightThing(null)
        );
    }
}

class HighlightedThing extends GenericHighlightedThing {

    protected onCursorOverThing(thing: Thing): void {
        if (!selectedVerb.verb) {
            return;
        }
        let verbInfo = VerbsInfo.get(selectedVerb.verb);

        if (selectedVerb.verb && verbInfo.singleObject) {

            this.highlightThing(thing);
        } else if (selectedVerb.verb && !verbInfo.singleObject) {
            this.highlightThingForMultipleObjectVerb(thing);
        }
    }

    private highlightThingForMultipleObjectVerb(thing: Thing): void {
        if (selectedThing.thing) {
            this.highlightThing(thing);
        } else if (thing.isInInventory()) {
            this.highlightThing(thing);
        }
    }

    protected onCursorOutThing(): void {
        this.highlightThing(null);
    }
}

export const highlightedThing = new HighlightedThing();
export const selectedThing = new SelectedThing();

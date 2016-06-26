import { selectedThing, highlightedThing } from '../state/SelectedObjects';
import { selectedVerb } from '../state/SelectedVerb.singleton';
import { TextWithShadow } from './TextWithShadow';
import { layout } from './LayoutManager.singleton';
import { uiLayers } from './UILayers.singleton';
import { label } from '../stores/Labels.store';
import { Verbs, VerbsInfo } from '../stores/Verbs.store';

export class CurrentActionUI {

    private text: TextWithShadow;
    private currentText: string;

    constructor(phaserGame) {
        this.createText();
        selectedVerb.subscribeToChange(newVerb => this.updateText());
        highlightedThing.subscribeToChange(newThing => this.updateText());
        selectedThing.subscribeToChange(newThing => this.updateText());
    }

    private createText(): void {
        debugger;
        this.text = new TextWithShadow({
            position: layout.CURRENT_ACTION_POSITION,
            layer: uiLayers.verbButtons,
            fixedToCamera: true
        });
}

    private updateText(): void {
        let newText = this.getVerbText() + this.getSelectedThingText() + ' ' + this.getThingText();
        this.setText(newText);
    }

    private setText(newText: string): void {
        if (this.currentText !== newText) {
            this.currentText = newText;
            this.text.setText(newText);
        }
    }

    private getVerbText(): string {
        let verb = selectedVerb.verb;
        return label(VerbsInfo.get(verb).label);
    }

    private getThingText(): string {
        let thing = highlightedThing.thing;
        let text = '';
        if (thing && thing.name) {
            text = label(thing.name);
        }
        return text;
    }

    private getSelectedThingText(): string {
        let verb = selectedVerb.verb;
        let verbInfo = VerbsInfo.get(verb);
        if (!verbInfo.singleObject && selectedThing.thing) {
            return ' ' + label(selectedThing.thing.name) + ' ' + label(verbInfo.conjuction);
        } else {
            return '';
        }
    }
}
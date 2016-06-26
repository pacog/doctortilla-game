import { Verbs } from '../stores/Verbs.store';
import { actionDispatcher, Actions } from '../utils/ActionDispatcher';
import { Observable , ICallback } from '../utils/Observable';

class SelectedVerb {

    private onChangeObservable: Observable;
    private selectedVerb: Verbs;

    constructor() {
        this.onChangeObservable = new Observable();
        this.reset();
        actionDispatcher.subscribeTo(
            Actions.SELECT_VERB,
            newVerb => this.selectNewVerb(newVerb)
        );
        actionDispatcher.subscribeTo(
            Actions.ACTION_APPLIED,
            () => this.reset()
        );
    }

    get verb(): Verbs {
        return this.selectedVerb;
    }

    subscribeToChange(callback: ICallback): void {
        this.onChangeObservable.registerObserver(callback);
        callback(this.selectedVerb);
    }

    unsubscribeToChange(callback: ICallback): void {
        this.onChangeObservable.removeObserver(callback);
    }

    notifySubscribers(): void {
        this.onChangeObservable.notifyObservers(this.selectedVerb);
    }

    private selectNewVerb(newVerb: Verbs): void {
        this.selectedVerb = newVerb;
        this.notifySubscribers();
    }

    private reset(): void {
        this.selectNewVerb(Verbs.GO_TO);
    }

}

export const selectedVerb = new SelectedVerb();

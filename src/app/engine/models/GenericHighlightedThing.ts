import { actionDispatcher, Actions } from '../utils/ActionDispatcher';
import { Observable, ICallback } from '../utils/Observable';
import { Thing } from './Thing';

export abstract class GenericHighlightedThing {

    private onChangeObservable: Observable;
    private highlightedThing: Thing;

    constructor() {
        this.onChangeObservable = new Observable();
        this.reset();

        actionDispatcher.subscribeTo(
            Actions.CURSOR_OVER_THING,
            thing => this.onCursorOverThing(thing)
        );

        actionDispatcher.subscribeTo(
            Actions.CURSOR_OUT_THING,
            thing => this.onCursorOutThing(thing)
        );
    }

    subscribeToChange(callback: ICallback): void {
        this.onChangeObservable.registerObserver(callback);
        callback(this.highlightedThing);
    }

    unsubscribeToChange(callback: ICallback): void {
        this.onChangeObservable.removeObserver(callback);
    }

    get thing(): Thing {
        return this.highlightedThing;
    }

    set thing(newThing: Thing) {
        this.highlightThing(newThing);
    }

    protected highlightThing(newThing: Thing): void {
        this.highlightedThing = newThing;
        this.notifySubscribers();
    }

    private reset(): void {
        this.highlightThing(null);
    }

    protected onCursorOverThing(thing: Thing): void  {}
    protected onCursorOutThing(thing: Thing): void  {}

    private notifySubscribers(): void {
        this.onChangeObservable.notifyObservers(this.highlightedThing);
    }

}

import { Observable, ICallback } from './Observable';

export enum Actions {
    CLICK_STAGE
}

class ActionDispatcher {

    private observersPerAction: Map<Actions, Observable>;

    constructor() {
        this.observersPerAction = new Map();
    }

    execute(action: Actions, ...params) {
        let actionObservable: Observable = this.observersPerAction.get(action);
        if (actionObservable) {
            actionObservable.notifyObservers(params);
        }
    }

    subscribeTo(action: Actions, callback: ICallback) {
        let actionObservable: Observable = this.observersPerAction.get(action);
        if (!actionObservable) {
            actionObservable = new Observable();
            this.observersPerAction.set(action, actionObservable);
        }
        actionObservable.registerObserver(callback);
    }
}

export const actionDispatcher = new ActionDispatcher();
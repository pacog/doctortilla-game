import { Observable, ICallback } from './Observable';

export enum Actions {
    CLICK_STAGE
}

class ActionDispatcher {

    private observersPerAction: Map<Actions, Observable>;

    constructor() {
        this.observersPerAction = new Map();
    }

    execute(action: Actions, param: any) {
        let actionObservable: Observable = this.observersPerAction.get(action);
        if (actionObservable) {
            actionObservable.notifyObservers(param);
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
/// <reference path="../../../../my-typings/lib.es6.d.ts" />
import { DEFAULT_LABELS } from './DefaultLabels';

export interface ILabelsPerLanguage {
    [index : string] : string;
};

export interface ILabels {
    [index : string] : ILabelsPerLanguage;
};

const DEFAULT_LANGUAGE = 'en';

class LabelsStore {
    private labels: Map<string, ILabelsPerLanguage>;
    private currentLanguage: string;

    constructor() {
        this.labels = new Map();
        this.currentLanguage = DEFAULT_LANGUAGE;
    }

    setLanguage(newLanguage: string): void {
        this.currentLanguage = newLanguage;
    }

    addLabels(labelsToAdd: ILabels): void {
        for(let key in labelsToAdd) {
            this.addLabelsForLanguage(key, labelsToAdd[key]);
        }
    }

    getLabel(labelName: string): string {
        let allLanguageLabels = this.labels.get(this.currentLanguage);
        if (!allLanguageLabels) {
            throw 'ERROR: trying to get label from non existing language';
        }
        return allLanguageLabels[labelName] || labelName;
    }

    private addLabelsForLanguage(language: string, labels: ILabelsPerLanguage): void {
        let previousLabels = this.labels.get(language) || {};
        let newLabels = Object.assign({}, previousLabels, labels);
        this.labels.set(language, newLabels);
    }
}
let labelsStoreSingleton = new LabelsStore();

labelsStoreSingleton.addLabels(<ILabels> DEFAULT_LABELS);

export const label = ((labelId: string) => {
    return labelsStoreSingleton.getLabel(labelId);
});

export const labelsStore = labelsStoreSingleton;

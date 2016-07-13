/// <reference path="../../../../my-typings/lib.es6.d.ts" />

class RandomText {
    private originalPhrases: Array<string>;
    private phrases: Array<string>;
    private lastText: string;

    constructor(phrases: Array<string>) {
        this.originalPhrases = phrases;
        this.createSet();
    }

    private createSet() {
        this.phrases = this.originalPhrases.slice();
    }

    getRandomText(): string {
        let result: string;

        if (this.phrases.length === 1) {
            result = this.phrases[0];
            this.lastText = result;
            this.createSet();
        } else {
            let randomIndex = Math.floor(this.phrases.length * Math.random());
            if (this.phrases[randomIndex] === this.lastText) {
                randomIndex = (randomIndex + 1) % this.phrases.length;
            }
            result = this.phrases[randomIndex];
            this.phrases.splice(randomIndex, 1);
            this.lastText = result;
        }

        return result;
    }
}

class RandomTextFactory {
    private generators: Map<string, RandomText>;
    constructor() {
        this.generators = new Map();
    }

    getRandomText(...phrases: Array<string>): string {
        let phrasesId = this.getIdFromPhrases(phrases);
        let generator = this.generators.get(phrasesId);
        if (!generator) {
            generator = new RandomText(phrases);
            this.generators.set(phrasesId, generator);
        }
        return generator.getRandomText();
    }

    private getIdFromPhrases(phrases: Array<string> = []): string {
        let id = phrases.join('#');
        if (id === '') {
            id = '#';
        }
        return id;
    }

}
const textFactory = new RandomTextFactory();
export const randomText = (...phrases: Array<string>) => {
    return textFactory.getRandomText(...phrases);
};
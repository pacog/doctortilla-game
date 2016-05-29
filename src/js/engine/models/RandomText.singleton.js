class RandomText {
    constructor(phrases) {
        this.originalPhrases = phrases;
        this._createSet();
    }

    _createSet() {
        this.phrases = this.originalPhrases.slice();
    }

    getRandomText() {
        let randomIndex = Math.floor(this.phrases.length * Math.random());

        let result = this.phrases[randomIndex];
        this.phrases.splice(randomIndex, 1);
        if (this.phrases.length === 0) {
            this._createSet();
        }
        return result;
    }
}

class RandomTextFactory {
    constructor() {
        this.generators = new Map();
    }

    r(...phrases) {
        let phrasesId = this._getIdFromPhrases(phrases);
        let generator = this.generators.get(phrasesId);
        if (!generator) {
            generator = new RandomText(phrases);
            this.generators.set(phrasesId, generator);
        }
        return generator.getRandomText();
    }

    _getIdFromPhrases(phrases = []) {
        let id = phrases.join('#');
        if (id === '') {
            id = '#';
        }
        return id;
    }

}

const randomText = new RandomTextFactory();
module.exports = randomText;
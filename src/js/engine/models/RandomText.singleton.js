class RandomText {
    constructor(phrases) {
        this.originalPhrases = phrases;
        this._createSet();
    }

    _createSet() {
        this.phrases = this.originalPhrases.slice();
    }

    getRandomText() {
        let result;
        if (this.phrases.length === 1) {
            result = this.phrases[0];
            this._lastText = result;
            this._createSet();
        } else {
            let randomIndex = Math.floor(this.phrases.length * Math.random());
            if (this.phrases[randomIndex] === this._lastText) {
                randomIndex = (randomIndex + 1) % this.phrases.length;
            }
            result = this.phrases[randomIndex];
            this.phrases.splice(randomIndex, 1);
            this._lastText = result;
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
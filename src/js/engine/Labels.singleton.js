class Labels {

    constructor() {
        this._currentLabels = {};
        this._labelsByLanguage = {};
        //TODO: choose language
        this._currentLanguage = 'es';
    }

    l(labelId) {
        let result = this._currentLabels[labelId];
        if (!result) {
            // console.warn('Missing label "' + labelId + '"');
        }
        return result || labelId;
    }

    setLanguage(newLanguage) {
        this._currentLanguage = newLanguage;
        this._currentLabels = this._labelsByLanguage[newLanguage] || {};
    }

    setLabels(labels) {
        this._labelsByLanguage = labels;
        this.setLanguage(this._currentLanguage);
    }
}

const labels = new Labels();
module.exports = labels;

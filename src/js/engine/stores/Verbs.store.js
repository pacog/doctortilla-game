const Verbs = Object.freeze({
    GO_TO: {
        label: 'Go to',
        singleObject: true
    },
    LOOK: {
        label: 'Look at',
        singleObject: true
    },
    CLOSE: {
        label: 'Close',
        singleObject: true
    },
    PUSH: {
        label: 'Push',
        singleObject: true
    },
    TAKE: {
        label: 'Take',
        singleObject: true
    },
    USE: {
        label: 'Use',
        singleObject: false,
        conjuction: 'with'
    },
    SPEAK: {
        label: 'Speak to',
        singleObject: true
    },
    GIVE: {
        label: 'Give',
        singleObject: false,
        conjuction: 'to'
    },
    OPEN: {
        label: 'Open',
        singleObject: true
    }

});

module.exports = Verbs;

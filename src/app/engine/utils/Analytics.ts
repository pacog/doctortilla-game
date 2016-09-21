class Analytics {

    sendEvent(category: string, action: string, label: string = undefined): void {
        if((<any>window).ga) {
            (<any>window).ga('send', 'event', category, action, label);
        }
    }
}

export const analytics = new Analytics();
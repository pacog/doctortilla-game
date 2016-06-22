const IMAGES = {
    'BACKSTAGE_BG': 'images/backstage/BACKSTAGE_BG.png'
};

class AssetsManager {

    loadAssets(game: Phaser.Game):void {
        this.loadImages(game);
        //TODO load sprites
    }

    private loadImages(game: Phaser.Game): void {
        for (let imageKey in IMAGES) {
            game.load.image(imageKey, IMAGES[imageKey]);
        }
    }
}

export const assetsManager = new AssetsManager();
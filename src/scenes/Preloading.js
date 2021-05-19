class Preloading extends Phaser.Scene {
    constructor() {
        super("preloadingScene");
    }

    preload() {
        this.load.image('loadingBar', './assets/placeholder_cat.png');
    }

    create() {
        this.scene.start('loadingScene');
    }
}
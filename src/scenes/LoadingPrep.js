class LoadingPrep extends Phaser.Scene {
    constructor() {
        super("loadingPrepScene");
    }

    preload() {
        this.load.image('loadingBar', './assets/placeholder_cat.png');
    }

    create() {
        this.scene.start('loadingScene');
    }
}
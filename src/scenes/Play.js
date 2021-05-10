class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    create() {
        this.add.text(game.config.width/2, game.config.height/2, "Play Scene", textConfig).setOrigin(0.5);
    }

    update() {

    }
}
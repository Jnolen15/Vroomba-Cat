class Tutorial extends Phaser.Scene {
    constructor() {
        super("tutorialScene");
    }

    create() {
        this.controller = new Controller(this);
    }

    update(time, delta) {
        this.controller.update(time, delta);
    }
}
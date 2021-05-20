class Tutorial extends Phaser.Scene {
    constructor() {
        super("tutorialScene");
    }

    create() {
        this.physics.world.setBounds(0,0,4000,768);
        this.controller = new Controller(this);
        this.controller.scene.cameras.main.setBounds(0,0,4000,768);
        this.vroombaCat = this.controller.cat.body;
        this.tutorialText = this.add.text(this.controller.cat.body.x, this.controller.cat.body.y, "Text", textConfig).setOrigin(0.5);
        this.tutorialText.alpha = 0;
    }

    update(time, delta) {
        this.controller.update(time, delta);
        this.tutorialText.setPosition(this.vroombaCat.x + this.vroombaCat.width/2, this.vroombaCat.y - 100);
        if(this.vroombaCat.x > 800 && this.vroombaCat.x < 1000) {
            this.tutorialText.setAlpha(1);
            this.tutorialText.setText("Use ←↑→ to move").setOrigin(0.5);
        }
        // else if(this.vroombaCat.x > 1000 && this.vroombaCat.x < 1400) {

        // }
    }
}
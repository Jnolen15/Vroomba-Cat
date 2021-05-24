class Tutorial extends Phaser.Scene {
    constructor() {
        super("tutorialScene");
    }

    create() {
        // this.scale.setGameSize(1024*2, 768*2);
        // this.scale.setZoom(.5);
        this.physics.world.setBounds(0,0,8000,768);
        this.controller = new Controller(this);
        this.controller.scene.cameras.main.setBounds(0,0,8000,768);
        this.vroombaCat = this.controller.cat.body;
        this.tutorialText = this.add.text(this.controller.cat.body.x, this.controller.cat.body.y, "Use ←→ or A/D to move.", textConfig).setOrigin(0.5);
        this.platform1 = this.controller.spawner.createPlatform('platform', 1500, 700, 3, 1);
        this.wall1 = this.controller.spawner.createPlatform('platform', 1400, 700, .25, 4);

        this.platform2 = this.controller.spawner.createPlatform('platform', 3500, 700, 3, 1);
        this.wall2 = this.controller.spawner.createPlatform('platform', 3400, 700, .25, 4);
        this.platform3 = this.controller.spawner.createPlatform('platform', 3500, 600, 3, 1);
        this.wall3 = this.controller.spawner.createPlatform('platform', 3400, 600, .25, 4);

        console.log(this.wall1);
        this.prop1 = this.controller.spawner.createProp('p_cup', 2250, game.config.height+200, 0.5);
        this.prop2 = this.controller.spawner.createProp('p_apple', 2550, game.config.height+200, 0.5);
        this.prop3 = this.controller.spawner.createProp('p_frame', 2750, game.config.height+200, 0.5);
        this.prop4 = this.controller.spawner.createBigProp('p_lamp1', 4500, game.config.height+200, 0.5);
        this.prop5 = this.controller.spawner.createAirProp('p_wallclock', 5500, game.config.height-200, 0.5);

        this.keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
        this.keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
    }

    update(time, delta) {
        this.controller.update(time, delta);
        this.tutorialText.setPosition(this.vroombaCat.x + this.vroombaCat.width/2, this.vroombaCat.y - 100);
        if(this.vroombaCat.x > 0 && this.vroombaCat.x < 1000) {
            this.tutorialText.setText("Use ←→ or A/D to move.");
        }
        else if(this.vroombaCat.x > 1000 && this.vroombaCat.x < 2000) {
            this.tutorialText.setText("Use ↑ or W to Jump!");
        }
        else if(this.vroombaCat.x > 2000 && this.vroombaCat.x < 3000) {
            this.tutorialText.setText("DESTROY OBJECTS!");
            if(this.prop1.destroyed && this.prop2.destroyed && this.prop3.destroyed) {
                this.tutorialText.setText("VACUUM FOR SPEED!");
            }
        }
        else if(this.vroombaCat.x > 3000 && this.vroombaCat.x < 4000) {
            this.tutorialText.setText("↑/W (x2) = Double Jump");
        }
        else if(this.vroombaCat.x > 4000 && this.vroombaCat.x < 5000) {
            this.tutorialText.setText("Mash ↓ or S to DESTROY!");
        }
        else if(this.vroombaCat.x > 5000 && this.vroombaCat.x < 6000) {
            this.tutorialText.setText("Jump & hit ↓ or S to DESTROY!");
        }
        else if(this.vroombaCat.x = 6000) {
            this.tutorialText.setText("Press (M)enu (P)lay!");
            if(Phaser.Input.Keyboard.JustDown(this.keyM)) this.scene.start("menuScene");
            else if(Phaser.Input.Keyboard.JustDown(this.keyP)) this.scene.start("playScene");
        }
    }
}
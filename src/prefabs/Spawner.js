class Spawner {
    constructor(scene, cat){
        // store variables
        this.scene = scene;
        this.cat = cat;
        // add spawner to the scene
        this.scene.add.existing(this);
        // Add platform group (Should find a better way to make the game map for the future)
        this.platformGroup = this.scene.physics.add.group();
        // Add collider between platformGroup and Cat
        this.scene.physics.add.collider(this.cat, this.platformGroup);
        this.keyF = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    }

    createProp(spriteName, xPos, yPos, scale) {
        let prop = new Object(this.scene, xPos, yPos, spriteName);
        prop.setOrigin(0.5); 
        prop.setScale(scale);
        // colliding with platforms
        this.scene.physics.add.collider(prop, this.platformGroup);
        // overlapping
        this.scene.physics.add.overlap(this.cat, prop, function(cat, prop) {
            console.log("prop hit!!");
            this.scene.sound.play('a1', { volume: 2 });
            this.spawnDebris(prop);
            this.scene.controller.addToScore();
            prop.destroy();
        }, null, this);
    }

    createBigProp(spriteName, xPos, yPos, scale) {
        let prop = new Object(this.scene, xPos, yPos, spriteName);
        prop.setOrigin(0.5); 
        prop.setScale(scale);
        // colliding with platforms
        this.scene.physics.add.collider(prop, this.platformGroup);
        // overlapping
        this.scene.physics.add.overlap(this.cat.swipeBox, prop, function(cat, prop) {
            if (Phaser.Input.Keyboard.JustDown(this.keyF)) {
                console.log("swiped big prop");
            } 
        }, null, this);
    }

    createPlatform(spriteName, xPos, yPos, scaleX, scaleY) {
        let platform = this.platformGroup.create(xPos, yPos, spriteName);
        platform.scaleX = scaleX;
        platform.scaleY = scaleY;
        platform.setImmovable(true);
    }

    bigPropCollider(obj) {
        // TEST -------------- add overlap for swipe hitbox
        this.scene.physics.add.overlap(this.cat.swipeBox, obj, function(cat, object) {
            if (Phaser.Input.Keyboard.JustDown(this.keyF)) {
                console.log("overlapping with prop");
            }
        }, null, this);
    }

    spawnDebris(object) {
        let debris = new Object(this.scene, object.x, object.y, 'debris');
        this.scene.physics.add.collider(debris, this.platformGroup);
        debris.alpha = 0;
        debris.active = false;
        // debris.setBodySize(75,10);
        console.log(this.debris);
        this.clock = this.scene.time.delayedCall(1000, () => {
            console.log(debris);
            debris.alpha = 1;
            debris.active = true;
            this.scene.physics.add.overlap(this.cat, debris, function(cat, deb) {
                this.scene.sound.play('a2', { volume: 1 });
                cat.turboChargeCat(this.scene);
                deb.destroy();
            }, null, this);
        }, null, this);
    }
}
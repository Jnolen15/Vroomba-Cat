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
        // Score rules
        this.propPoints = 5;
        this.bigPropPoints = 2;
        this.airPropPoints = 5;
    }

    createProp(spriteName, xPos, yPos, scale) {
        let prop = new Object(this.scene, xPos, yPos, spriteName);
        prop.setOrigin(0.5); 
        prop.setScale(scale);
        // colliding with platforms
        this.scene.physics.add.collider(prop, this.platformGroup);
        // overlapping
        this.scene.physics.add.overlap(this.cat, prop, function(cat, prop) {
            // console.log("prop hit!!");
            this.scene.sound.play('a1', { volume: 2 });
            this.spawnDebris(prop);
            this.scene.controller.addToScore(this.propPoints);
            this.makeScorePopUp(prop, this.propPoints);
            prop.destroy();
            prop.destroyed = true;
            this.scene.cameras.main.shake(20, 0.01);
        }, null, this);
        return prop;
    }

    createBigProp(spriteName, xPos, yPos, scale) {
        let prop = new Object(this.scene, xPos, yPos, spriteName);
        prop.setOrigin(0.5); 
        prop.setScale(scale);
        let hitCount = 0;
        // colliding with platforms
        this.scene.physics.add.collider(prop, this.platformGroup);
        // overlapping
        this.scene.physics.add.overlap(this.cat.swipeBox, prop, function(cat, prop) {
            if (Phaser.Input.Keyboard.JustDown(this.keyF)) {
                if(hitCount >= 14){
                    hitCount = 0;
                    this.scene.sound.play('a1', { volume: 2 });
                    this.spawnDebris(prop);
                    prop.destroy();
                    this.scene.cameras.main.shake(109, 0.03);
                } else {
                    hitCount++;
                    this.scene.controller.addToScore(this.bigPropPoints);
                    this.makeScorePopUp(prop, this.bigPropPoints);
                    console.log("swiped big prop " + hitCount + " times");
                    this.scene.cameras.main.shake(20, 0.01);
                }
            } 
        }, null, this);
    }

    createAirProp(spriteName, xPos, yPos, scale) {
        let prop = new Object(this.scene, xPos, yPos, spriteName);
        prop.setOrigin(0.5); 
        prop.setScale(scale);
        // colliding with platforms
        this.scene.physics.add.collider(prop, this.platformGroup);
        // overlapping
        this.scene.physics.add.overlap(this.cat.swipeBox, prop, function(cat, prop) {
            if (Phaser.Input.Keyboard.JustDown(this.keyF) && !this.cat.body.touching.down) {
                this.cat.body.velocity.y = -this.cat.jumpSpeed;
                this.scene.controller.addToScore(this.airPropPoints);
                this.makeScorePopUp(prop, this.airPropPoints);
                prop.destroy();
            } 
        }, null, this);
        prop.setImmovable(true);
        prop.body.setAllowGravity(false);
    }

    createPlatform(spriteName, xPos, yPos, scaleX, scaleY) {
        let platform = this.platformGroup.create(xPos, yPos, spriteName);
        platform.scaleX = scaleX;
        platform.scaleY = scaleY;
        platform.setImmovable(true);
        return platform;
    }

    spawnDebris(object) {
        let debris = new Object(this.scene, object.x, object.y, 'debris');
        this.scene.physics.add.collider(debris, this.platformGroup);
        debris.alpha = 0;
        debris.active = false;
        debris.setScale(.5);
        // debris.setBodySize(75,10);
        // console.log(this.debris);
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

    makeScorePopUp(object, points) {
        let xPos = (object.x) + Phaser.Math.FloatBetween(-3, 3)
        let yPos = (object.y) + Phaser.Math.FloatBetween(-6, 6);
        let pointsText = this.scene.add.text(xPos, yPos, '+' + points, tinyScoreConfig);
        let multiplierText = this.scene.add.text(xPos+pointsText.width*.9, yPos,' X' + this.scene.controller.scoreMulti, tinyMultConfig);
        pointsText.setOrigin(.5,.5);
        pointsText.setDepth(2);
        multiplierText.setOrigin(.5,.5);
        multiplierText.setDepth(2);
        this.scene.time.delayedCall(800, () => {
            pointsText.destroy();
            multiplierText.destroy();
        }, pointsText, this);
    }
}
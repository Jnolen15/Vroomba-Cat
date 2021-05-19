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
    }

    createProp(spriteName, xPos, yPos, scale) {
        let prop = new Object(this.scene, xPos, yPos, spriteName);
        prop.setOrigin(0.5); 
        prop.setScale(scale);
        this.objectCollider(prop);
    }

    createPlatform(spriteName, xPos, yPos, scaleX, scaleY) {
        let platform = this.platformGroup.create(xPos, yPos, spriteName);
        platform.scaleX = scaleX;
        platform.scaleY = scaleY;
        platform.setImmovable(true);
    }
    
    objectCollider(obj) {
        this.scene.physics.add.collider(obj, this.platformGroup);
        this.scene.physics.add.overlap(this.cat, obj, function(cat, object) {
            console.log("object hit!!");
            this.scene.sound.play('a1', { volume: 2 });
            this.spawnDebris(object);
            this.scene.controller.addToScore();
            object.destroy();
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
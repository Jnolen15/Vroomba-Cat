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
        
        // spawn and place objects
        this.createProp('prop', game.config.width*0.25, game.config.height*0.7, 0.5);
        this.createProp('prop', game.config.width*0.75, game.config.height*0.5, 0.5);
        this.createProp('prop', game.config.width*0.20, game.config.height*0.9, 0.5);
        this.createProp('prop', game.config.width*0.90, game.config.height*0.9, 0.5);

        // Add platforms
        this.createPlatform('platform', game.config.width/2, game.config.height, 8, 1);
        this.createPlatform('platform', 700, 400, 4, 1);
        this.createPlatform('platform', 100, 300, 3, 1);
        this.createPlatform('platform', 300, 540, 2, 1);
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
            this.scene.addToScore();
            object.destroy();
        }, null, this);
    }

    spawnDebris(object) {
        this.debris = new Object(this.scene, object.x, object.y, 'temp').setOrigin(0.5);
        this.scene.physics.add.collider(this.debris, this.platformGroup);
        this.debris.alpha = 0;
        this.debris.active = false;
        this.debris.setBodySize(75,10);
        this.clock = this.scene.time.delayedCall(1000, () => {
            this.debris.alpha = 1;
            this.debris.active = true;
            this.scene.physics.add.overlap(this.cat, this.debris, function(cat, deb) {
                console.log("debris hit!!");
                this.scene.sound.play('a2', { volume: 1 });
                cat.turboChargeCat(this.scene);
                deb.destroy();
            }, null, this);
        }, null, this);
    }
}
class Spawner {
    constructor(scene, cat){
        scene.add.existing(this);
        this.obj1 = new Object(scene, game.config.width*0.25, game.config.height*0.7, 'prop').setOrigin(0.5); this.obj1.setScale(0.5);
        this.obj2 = new Object(scene, game.config.width*0.75, game.config.height*0.5, 'prop').setOrigin(0.5); this.obj2.setScale(0.5);
        this.obj3 = new Object(scene, game.config.width*0.20, game.config.height*0.9, 'prop').setOrigin(0.5); this.obj3.setScale(0.5);
        this.obj4 = new Object(scene, game.config.width*0.90, game.config.height*0.9, 'prop').setOrigin(0.5); this.obj4.setScale(0.5);

        // Add platform group (Should find a better way to make the game map for the future)
        this.platformGroup = scene.physics.add.group();
        // Add collider between platformGroup and Cat
        scene.physics.add.collider(cat, this.platformGroup);
        this.objectCollider(scene,cat,this.obj1,this.platformGroup);
        this.objectCollider(scene,cat,this.obj2,this.platformGroup);
        this.objectCollider(scene,cat,this.obj3,this.platformGroup);
        this.objectCollider(scene,cat,this.obj4,this.platformGroup);

        // Add platforms
        this.platform = this.platformGroup.create(game.config.width/2, game.config.height, "platform");
        this.platform.scaleX = 8;
        this.platform.setImmovable(true);

        this.platform = this.platformGroup.create(700, 400, "platform");
        this.platform.scaleX = 4;
        this.platform.setImmovable(true);

        this.platform = this.platformGroup.create(100, 300, "platform");
        this.platform.scaleX = 3;
        this.platform.setImmovable(true);

        this.platform = this.platformGroup.create(300, 540, "platform");
        this.platform.scaleX = 2;
        this.platform.setImmovable(true);
    }

    objectCollider(scene, cat, obj) {
        scene.physics.add.collider(obj, this.platformGroup);
        scene.physics.add.overlap(cat, obj, function(cat, object) {
            console.log("object hit!!");
            scene.sound.play('a1', { volume: 2 });
            this.spawnDebris(scene, cat, object);
            scene.addToScore();
            object.destroy();
        }, null, this);
    }

    spawnDebris(scene, cat, object) {
        this.debris = new Object(scene, object.x, object.y, 'temp').setOrigin(0.5);
        scene.physics.add.collider(this.debris, this.platformGroup);
        this.debris.alpha = 0;
        this.debris.active = false;
        this.debris.setBodySize(75,10);
        this.clock = scene.time.delayedCall(1000, () => {
            this.debris.alpha = 1;
            this.debris.active = true;
            scene.physics.add.overlap(cat, this.debris, function(cat, deb) {
                console.log("debris hit!!");
                scene.sound.play('a2', { volume: 1 });
                cat.turboChargeCat(scene);
                deb.destroy();
            }, null, this);
        }, null, this);
    }
}
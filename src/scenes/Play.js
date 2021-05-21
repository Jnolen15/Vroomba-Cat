class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload(){        
        // Load Json file
        this.load.tilemapTiledJSON('level', './assets/tilemap/tm_test.json');
        // Load Spritesheet
        this.load.image('furniture', './assets/tilemap/ts_furniture.png');
        this.load.image('collision', './assets/tilemap/ts_collision.png');
    }
    
    create() {
        
        // Add controller
        this.controller = new Controller(this);

        //Create the tilemap
        const map = this.add.tilemap('level');

        // add a tileset to the map
        const tsFurniture = map.addTilesetImage('ts_furniture', 'furniture');
        const tsCollision = map.addTilesetImage('ts_collision', 'collision');

        // create tilemap layers
        const FurnitureLayer = map.createLayer('furnitureLayer', tsFurniture, 0, 0);
        FurnitureLayer.setScale(.35);

        const CollisionLayer = map.createLayer('collisionLayer', tsCollision, 0, 105);
        CollisionLayer.setScale(.35);

        // Collision
        CollisionLayer.setCollisionFromCollisionGroup();
        this.physics.add.collider(this.controller.cat, CollisionLayer);

        this.physics.add.overlap(this.controller.cat, CollisionLayer, function(cat, layer) {
            //this.cameras.main.shake(20, 0.01);
        }, null, this);
        
        // spawn and place objects
        this.controller.spawner.createProp('prop', game.config.width*0.1, game.config.height*0.9, 0.5);
        this.controller.spawner.createProp('prop', game.config.width*0.30, game.config.height*0.6, 0.5);
        this.controller.spawner.createProp('prop', game.config.width*0.75, game.config.height*0.8, 0.5);
        this.controller.spawner.createProp('prop', game.config.width*0.90, game.config.height*0.4, 0.5);

        this.controller.spawner.createBigProp('prop', game.config.width*0.1, game.config.height*0.1, 1);

        this.controller.spawner.createAirProp('prop', game.config.width*0.5, game.config.height*0.8, 0.5);

        this.controller.spawner.createPlatform('platform', game.config.width*.5, game.config.height, 8, 1);
        this.controller.spawner.createPlatform('platform', game.config.width*.06, game.config.height*.85, 1.5, 1);
        this.controller.spawner.createPlatform('platform', 700, 400, 4, 1);
        this.controller.spawner.createPlatform('platform', 100, 300, 3, 1);
        this.controller.spawner.createPlatform('platform', 300, 540, 2, 1);
    }

    update(time, delta) {
        this.controller.update(time, delta);
    }
}
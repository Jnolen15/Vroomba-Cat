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
        CollisionLayer.alpha = 0;

        // Collision
        CollisionLayer.setCollisionFromCollisionGroup();
        // This part of code from https://www.html5gamedevs.com/topic/40484-jump-through-a-tile-from-underneath/
        CollisionLayer.layer.data.forEach((row) => { // here we are iterating through each tile.
			row.forEach((Tile) => {
						Tile.collideDown = false;
						Tile.collideLeft = false;
						Tile.collideRight = false;
			})
		});

        // Add controller
        this.controller = new Controller(this, CollisionLayer);

        // Collision with player
        //this.physics.add.collider(this.controller.cat, CollisionLayer);
        
        // spawn and place objects
        this.controller.spawner.createProp('prop', game.config.width*0.1, game.config.height*0.9, 0.5, CollisionLayer);
        this.controller.spawner.createProp('prop', game.config.width*0.30, game.config.height*0.6, 0.5, CollisionLayer);
        this.controller.spawner.createProp('prop', game.config.width*0.75, game.config.height*0.8, 0.5, CollisionLayer);
        this.controller.spawner.createProp('prop', game.config.width*0.90, game.config.height*0.4, 0.5, CollisionLayer);

        this.controller.spawner.createBigProp('prop', game.config.width*0.1, game.config.height*0.1, 1, CollisionLayer);

        this.controller.spawner.createAirProp('prop', game.config.width*0.5, game.config.height*0.8, 0.5);
    }

    update(time, delta) {
        this.controller.update(time, delta);
    }
}
class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload(){        
        // Load Json file
        this.load.tilemapTiledJSON('level', './assets/tilemap/tm_test.json');
        // Load Spritesheet
        this.load.image('furniture', './assets/tilemap/ts_furniture.png');
    }
    
    create() {
        
        // Add controller
        this.controller = new Controller(this);

        //Create the tilemap
        const map = this.add.tilemap('level');

        // add a tileset to the map
        const tileset = map.addTilesetImage('ts_furniture', 'furniture');

        // create tilemap layers
        const FurnitureLayer = map.createLayer('furnitureLayer', tileset);
        FurnitureLayer.setScale(.35);
        
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
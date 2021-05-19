class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload(){        
        // Load Json file
        this.load.tilemapTiledJSON('level', './assets/tilemap/tilemap_Test.json');
        // Load Spritesheet
        this.load.image('fridge', './assets/static_fridge.png');
    }
    
    create() {
        /*// Add controller
        this.controller = new Controller(this);

        //Create the tilemap
        const map = this.add.tilemap('level');

        // add a tileset to the map
        const tileset = map.addTilesetImage('static_fridge', 'fridge');

        // create tilemap layers
        const FurnitureLayer = map.createLayer('FridgeLayer', tileset);*/
        
        this.controller = new Controller(this);
        
        // spawn and place objects
        this.controller.spawner.createProp('prop', game.config.width*0.25, game.config.height*0.7, 0.5);
        this.controller.spawner.createProp('prop', game.config.width*0.75, game.config.height*0.5, 0.5);
        this.controller.spawner.createProp('prop', game.config.width*0.20, game.config.height*0.9, 0.5);
        this.controller.spawner.createProp('prop', game.config.width*0.90, game.config.height*0.9, 0.5);

        this.controller.spawner.createPlatform('platform', game.config.width/2, game.config.height, 8, 1);
        this.controller.spawner.createPlatform('platform', 700, 400, 4, 1);
        this.controller.spawner.createPlatform('platform', 100, 300, 3, 1);
        this.controller.spawner.createPlatform('platform', 300, 540, 2, 1);
    }

    update(time, delta) {
        this.controller.update(time, delta);
    }
}
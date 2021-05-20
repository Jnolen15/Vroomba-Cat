class Loading extends Phaser.Scene {
    constructor() {
        super("loadingScene");
    }

    preload() {
        // --- Loading-visual setup
        var loadingBar = this.add.image(game.config.width / 2,game.config.height / 2,'loadingBar');
        var loadingText = this.make.text({
            x: game.config.width*.5,
            y: game.config.height*.5,
            text: 'Loading...',
            style: {
                font: '25px Courier',
                fill: '#b3cfdd'
            }
        }).setOrigin(.5);
        loadingText.setOrigin(0.5, 0.5);
        // loading-event listeners
        this.load.on('progress', function (value) {
            loadingBar.frame.cutWidth = loadingBar.frame.width * value;
        });            
        this.load.on('complete', function () {
            loadingBar.destroy();
            loadingText.destroy();
        });

        // --- Loading data
        // Add images
        this.load.image('cat', './assets/placeholder_cat.png');
        this.load.image('platform', './assets/placeholder_Platform.png');
        this.load.image('prop', './assets/prop_cup.png');
        this.load.image('comboMeter', './assets/placeholder_comboMeter.png');
        this.load.image('debris', './assets/prop_dust.png');
        // Add audio
        this.load.audio('a1', './assets/audio_1.mp3');
        this.load.audio('a2', './assets/audio_2.mp3');
        this.load.audio('a3', './assets/audio_3.mp3');
    }

    create() {
        this.scene.start('menuScene');
    }
}
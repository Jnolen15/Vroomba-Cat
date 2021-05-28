class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    create() {
        // Set up keys
        this.keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // Display menu text
        this.title = this.add.text(game.config.width/2, game.config.height * .30, "Vroomba Cat", textConfig).setOrigin(0.5);
        this.startButton = this.add.text(game.config.width/2, game.config.height * .50, "[↑] Start Game", textConfig).setOrigin(0.5);
        this.tutorialButton = this.add.text(game.config.width/2, game.config.height * .58, "[↓] Tutorial", textConfig).setOrigin(0.5);
        this.regModeButton = this.add.text(this.startButton.x + 50, this.startButton.y, "[↑] Regular Mode", textConfig).setOrigin(0.5);
        this.speedModeButton = this.add.text(this.startButton.x + 50, this.startButton.y, "[↓] Speed Run Mode", textConfig).setOrigin(0.5);
        
        // Sets the extra play options to be invisible
        this.regModeButton.alpha = 0;
        this.speedModeButton.alpha = 0;

        // Anchor points for the text
        this.startButtonXAnchor = this.startButton.x;
        this.tutorialButtonXAnchor = this.tutorialButton.x;
        this.regModeButtonXAnchor = this.regModeButton.x;
        this.regModeButtonYAnchor = this.regModeButton.y;
        this.speedModeButtonXAnchor = this.speedModeButton.x;
        this.speedModeButtonYAnchor = this.speedModeButton.y;
        
        // Boolean flags to determine which options are selected
        this.startSelected = false;
        this.tutorialSelected = false;
        this.startModeOptions = false;
        this.regModeSelected = false;
        this.speedModeSelected = false;

        // Jumping title animation
        this.tweens.add({
            targets: this.title,
            y: this.title.y + 100,
            ease: 'Bounce',
            yoyo: 1,
            repeat: -1,
            hold: 3000,
            duration: 1000,
        });

        // Background Music
        this.bg_music = this.sound.add('music', {loop: true});
        this.bg_music.play();
        console.log(this.bg_music);
    }

    update() {  
        // console.log('start: ' + this.startSelected + 
        //             '\ntutorial: ' + this.tutorialSelected +
        //             '\nstartOptions: ' + this.startModeOptions +
        //             '\nregMode: ' + this.regModeSelected +
        //             '\nspeedMode: ' + this.speedModeSelected);

        // Animation for hovering the Start Game Button
        if(!this.startSelected && Phaser.Input.Keyboard.JustDown(this.keyUP)) {
            if(this.tutorialSelected) { this.tweens.add({ targets: this.tutorialButton, x: this.tutorialButtonXAnchor, ease: 'Linear', duration: 1000,}); }
            this.tweens.add({ targets: this.startButton, x: this.startButton.x + 50, ease: 'Linear', duration: 1000, });
            this.startSelected = true;
            this.tutorialSelected = false;
        }

        // Animation for selecting Start Game and receiving game options {Regular Mode vs Speed Run Mode}
        if(this.startSelected && !this.startModeOptions && Phaser.Input.Keyboard.JustDown(this.keyRIGHT)) {
            this.tweens.add({ targets: this.regModeButton, x: this.regModeButton.x + 200, y: this.regModeButton.y - 50, ease: 'Linear', duration: 1000, alpha: 1, });
            this.tweens.add({ targets: this.speedModeButton, x: this.speedModeButton.x + 200, y: this.speedModeButton.y + 50, ease: 'Linear', duration: 1000, alpha: 1, });
            this.startModeOptions = true;
        }

        // Animation for hovering the Regular Mode
        if(this.startModeOptions &&  !this.regModeSelected && Phaser.Input.Keyboard.JustDown(this.keyUP)) {
            if(this.speedModeSelected) { this.tweens.add({ targets: this.speedModeButton, x: this.speedModeButton.x - 50, ease: 'Linear', duration: 1000, }); }
            this.tweens.add({ targets: this.regModeButton, x: this.regModeButton.x + 50, ease: 'Linear', duration: 1000, });
            this.regModeSelected = true;
            this.speedModeSelected = false;
        }

        // Animation for hovering Speed Run Mode
        if(this.startModeOptions && !this.speedModeSelected && Phaser.Input.Keyboard.JustDown(this.keyDOWN)) {
            if(this.regModeSelected) { this.tweens.add({ targets: this.regModeButton, x: this.regModeButton.x - 50, ease: 'Linear', duration: 1000, });}
            this.tweens.add({ targets: this.speedModeButton, x: this.speedModeButton.x + 50, ease: 'Linear', duration: 1000, });
            this.speedModeSelected = true;
            this.regModeSelected = false;
        }

        // Starts the game if player selected to play one of the modes
        if((this.regModeSelected || this.speedModeSelected) && Phaser.Input.Keyboard.JustDown(this.keyRIGHT)) {
            if(this.speedModeSelected) { speedrunMode = true; } 
            else { speedrunMode = false; }
            this.resetFlags();

            game.settings = { gameTimer: 30000 }
            this.bg_music.stop();
            console.log(speedrunMode);
            this.scene.start('playScene');
        }
        
        // Animation for hovering Tutorial Button
        if(!this.tutorialSelected && !this.startModeOptions && Phaser.Input.Keyboard.JustDown(this.keyDOWN)) {
            if(this.startSelected) {
                this.tweens.add({ targets: this.regModeButton, x: this.regModeButtonXAnchor, y: this.regModeButtonYAnchor, ease: 'Linear', duration: 1000, alpha: 0, });
                this.tweens.add({ targets: this.speedModeButton, x: this.speedModeButtonXAnchor, y: this.speedModeButtonYAnchor, ease: 'Linear', duration: 1000, alpha: 0, });
                this.tweens.add({ targets: this.startButton, x: this.startButtonXAnchor, ease: 'Linear', duration: 1000, });
            }
            this.tweens.add({ targets: this.tutorialButton, x: this.tutorialButton.x + 50, ease: 'Linear', duration: 1000, });
            this.startSelected = false;
            this.tutorialSelected = true;
        }
       
        // Starts the tutorial if player selects the tutorial button
        if(this.tutorialSelected && Phaser.Input.Keyboard.JustDown(this.keyRIGHT)) {
            game.settings = { gameTimer: 600000 }
            speedrunMode = false;
            this.bg_music.stop();
            this.scene.start('tutorialScene');
        }

        // Resets all options if player hits left arrow - Goes back to the default menu
        if(Phaser.Input.Keyboard.JustDown(this.keyLEFT)) {
            this.resetFlags();
            this.tweens.add({ targets: this.startButton, x: this.startButtonXAnchor, ease: 'Linear', duration: 1000, });
            this.tweens.add({ targets: this.tutorialButton, x: this.tutorialButtonXAnchor, ease: 'Linear', duration: 1000, });
            this.tweens.add({ targets: this.regModeButton, x: this.regModeButtonXAnchor, y: this.regModeButtonYAnchor, ease: 'Linear', duration: 1000, alpha: 0, });
            this.tweens.add({ targets: this.speedModeButton, x: this.speedModeButtonXAnchor, y: this.speedModeButtonYAnchor, ease: 'Linear', duration: 1000, alpha: 0, });
        }
    }

    resetFlags() {
        this.regModeSelected = false;
        this.speedModeSelected = false;
        this.startModeOptions = false;
        this.startSelected = false;
        this.tutorialSelected = false;
    }
}
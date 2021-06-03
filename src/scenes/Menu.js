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
        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        // Menu Background
        this.add.image(game.config.width/2,game.config.height/2,'bg').setOrigin(0.5);

        // Display menu text
        //this.title = this.add.text(game.config.width * 0.25, game.config.height * .30, "Vroomba Cat", textConfig).setOrigin(0.5);
        this.startButton = this.add.text(game.config.width * 0.25, game.config.height * .52, "[↑] Play", textConfig).setOrigin(0.5);
        this.tutorialButton = this.add.text(game.config.width * 0.25 , game.config.height * .6, "[↓] Tutorial", textConfig).setOrigin(0.5);
        this.regModeButton = this.add.text(this.startButton.x + 50, this.startButton.y, "[↑] Regular Mode", textConfig).setOrigin(0.5);
        this.speedModeButton = this.add.text(this.startButton.x + 50, this.startButton.y, "[↓] Speed Run Mode", textConfig).setOrigin(0.5);
        
        // Load Logo
        this.logo = this.add.image(game.config.width * 0.75, game.config.height * .10, 'logo').setOrigin(0.5);

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
            targets: this.logo,
            y: this.logo.y + 100,
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
        this.bg_music.volume = 0;

        this.resetFlags();
    }
    

    update() {  
        // console.log('start: ' + this.startSelected + 
        //             '\ntutorial: ' + this.tutorialSelected +
        //             '\nstartOptions: ' + this.startModeOptions +
        //             '\nregMode: ' + this.regModeSelected +
        //             '\nspeedMode: ' + this.speedModeSelected);

        // Animation for hovering the Start Game Button
        if(!this.startSelected && (Phaser.Input.Keyboard.JustDown(this.keyUP) || Phaser.Input.Keyboard.JustDown(this.keyW))) {
            this.sound.play('Select', { volume: 0.5 });
            if(this.tutorialSelected) { 
                this.tweens.add({ targets: this.tutorialButton, x: this.tutorialButtonXAnchor, ease: 'Linear', duration: 200,}); 
                this.tutorialButton.setText("[↓] Tutorial");
            }
            this.tweens.add({ targets: this.startButton, x: this.startButton.x + 50, ease: 'Linear', duration: 200, });
            this.startButton.setText("[→] Play");
            this.startSelected = true;
            this.tutorialSelected = false;
        }

        // Animation for selecting Start Game and receiving game options {Regular Mode vs Speed Run Mode}
        if(this.startSelected && !this.startModeOptions && (Phaser.Input.Keyboard.JustDown(this.keyRIGHT) || Phaser.Input.Keyboard.JustDown(this.keyD))) {
            this.sound.play('Start', { volume: 0.5 });
            this.tweens.add({ targets: this.regModeButton, x: this.regModeButton.x + 250, y: this.regModeButton.y - 50, ease: 'Linear', duration: 200, alpha: 1, });
            this.tweens.add({ targets: this.speedModeButton, x: this.speedModeButton.x + 250, y: this.speedModeButton.y + 50, ease: 'Linear', duration: 200, alpha: 1, });
            this.startButton.setText("[←] Play");
            this.startModeOptions = true;
        }

        // Animation for hovering the Regular Mode
        if(this.startModeOptions &&  !this.regModeSelected && (Phaser.Input.Keyboard.JustDown(this.keyUP) || Phaser.Input.Keyboard.JustDown(this.keyW))) {
            this.sound.play('Select', { volume: 0.5 });
            if(this.speedModeSelected) { 
                this.tweens.add({ targets: this.speedModeButton, x: this.speedModeButton.x - 50, ease: 'Linear', duration: 200, }); 
                this.speedModeButton.setText("[↓] Speed Run Mode");
            }
            this.tweens.add({ targets: this.regModeButton, x: this.regModeButton.x + 50, ease: 'Linear', duration: 200, });
            this.regModeButton.setText("[→] Regular Mode: \nSmash as many objects as you \ncan within the time limit! \nHow high of a score can you get!");
            this.regModeSelected = true;
            this.speedModeSelected = false;
        }

        // Animation for hovering Speed Run Mode
        if(this.startModeOptions && !this.speedModeSelected && (Phaser.Input.Keyboard.JustDown(this.keyDOWN) || Phaser.Input.Keyboard.JustDown(this.keyS))) {
            this.sound.play('Select', { volume: 0.5 });
            if(this.regModeSelected) { 
                this.tweens.add({ targets: this.regModeButton, x: this.regModeButton.x - 50, ease: 'Linear', duration: 200, });
                this.regModeButton.setText("[↑] Regular Mode");
            }
            this.tweens.add({ targets: this.speedModeButton, x: this.speedModeButton.x + 50, ease: 'Linear', duration: 200, });
            this.speedModeButton.setText("[→] Speed Run Mode: \nDestroy every object in the \nlevel as fast as you can! \nThe quicker the better!");
            this.speedModeSelected = true;
            this.regModeSelected = false;
        }

        // Starts the game if player selected to play one of the modes
        if((this.regModeSelected || this.speedModeSelected) && (Phaser.Input.Keyboard.JustDown(this.keyRIGHT) || Phaser.Input.Keyboard.JustDown(this.keyD))) {
            this.sound.play('Start', { volume: 0.5 });
            if(this.speedModeSelected) { speedrunMode = true; } 
            else { speedrunMode = false; }
            //this.resetFlags();

            game.settings = { gameTimer: 30000 }
            this.bg_music.stop();
            console.log(speedrunMode);
            if(this.speedModeSelected) { this.resetFlags(); this.scene.start('speedrunScene');} 
            else { this.resetFlags(); this.scene.start('playScene');}
        }
        
        // Animation for hovering Tutorial Button
        if(!this.tutorialSelected && !this.startModeOptions && (Phaser.Input.Keyboard.JustDown(this.keyDOWN) || Phaser.Input.Keyboard.JustDown(this.keyS))) {
            this.sound.play('Select', { volume: 0.5 });
            if(this.startSelected) {
                this.startButton.setText("[↑] Play");
                this.tweens.add({ targets: this.regModeButton, x: this.regModeButtonXAnchor, y: this.regModeButtonYAnchor, ease: 'Linear', duration: 200, alpha: 0, });
                this.tweens.add({ targets: this.speedModeButton, x: this.speedModeButtonXAnchor, y: this.speedModeButtonYAnchor, ease: 'Linear', duration: 200, alpha: 0, });
                this.tweens.add({ targets: this.startButton, x: this.startButtonXAnchor, ease: 'Linear', duration: 200, });
            }
            this.tutorialButton.setText("[→] Tutorial");
            this.tweens.add({ targets: this.tutorialButton, x: this.tutorialButton.x + 50, ease: 'Linear', duration: 200, });
            this.startSelected = false;
            this.tutorialSelected = true;
        }
       
        // Starts the tutorial if player selects the tutorial button
        if(this.tutorialSelected && (Phaser.Input.Keyboard.JustDown(this.keyRIGHT) || Phaser.Input.Keyboard.JustDown(this.keyD))) {
            this.sound.play('Start', { volume: 0.5 });
            game.settings = { gameTimer: 600000 }
            speedrunMode = false;
            this.bg_music.stop();
            this.scene.start('tutorialScene');
        }

        // Resets all options if player hits left arrow - Goes back to the default menu
        if(Phaser.Input.Keyboard.JustDown(this.keyLEFT) || Phaser.Input.Keyboard.JustDown(this.keyA)) {
            this.sound.play('Select', { volume: 0.5 });
            this.resetFlags();
            this.startButton.setText("[↑] Play");
            this.tutorialButton.setText("[↓] Tutorial");
            this.regModeButton.setText("[↑] Regular Mode");
            this.speedModeButton.setText("[↓] Speed Run Mode");
            this.tweens.add({ targets: this.startButton, x: this.startButtonXAnchor, ease: 'Linear', duration: 200, });
            this.tweens.add({ targets: this.tutorialButton, x: this.tutorialButtonXAnchor, ease: 'Linear', duration: 200, });
            this.tweens.add({ targets: this.regModeButton, x: this.regModeButtonXAnchor, y: this.regModeButtonYAnchor, ease: 'Linear', duration: 200, alpha: 0, });
            this.tweens.add({ targets: this.speedModeButton, x: this.speedModeButtonXAnchor, y: this.speedModeButtonYAnchor, ease: 'Linear', duration: 200, alpha: 0, });
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
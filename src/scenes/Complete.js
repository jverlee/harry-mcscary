import Phaser from 'phaser'

export default class Complete extends Phaser.Scene
{
	constructor()
	{
		super('complete')
        this.score = 0
        this.points = 0 // total
        this.playerCount = 3
        this.timeLeft = 0
	}

    init(data)
    {
        this.playerCount = (data.playerCount) ? data.playerCount : this.playerCount;
        this.timeLeft = (data.timeLeft) ? data.timeLeft : this.timeLeft;
        this.score = (data.score) ? data.score : this.score;
        this.points = this.score + this.timeLeft
    }

	preload()
    {

        this.load.image('background', 'assets/backgrounds/menu.png');
        this.load.image('logo', 'assets/objects/win.png');
        this.load.image('red', 'http://labs.phaser.io/assets/particles/red.png')
        this.load.image('restart', 'assets/buttons/restart.png')
        this.load.audio("win", 'assets/sounds/win.mp3');
    }

    create()
    {

        this.game.sound.stopAll(); // stop any sound that may still be going

        this.bgMusic = this.sound.add("win", { loop: true });
        this.bgMusic.play();

        this.add.image(400, 300, 'background')

        this.add.text(230, 200, this.points + " Points").setFontSize(80).setColor('#000000').setFontFamily("Arial");

        this.add.text(285, 290, "(" + this.score + " Stars + " + this.timeLeft + " Time Bonus)").setFontSize(18).setColor('#000000').setFontFamily("Arial");

        let restart = this.add.image(400, 400, 'restart').setInteractive({ useHandCursor: true  });

        restart.on('pointerdown', (pointer) => {
            this.bgMusic.stop();
            this.scene.start('game', { playerCount: this.playerCount })
        });

    }

}

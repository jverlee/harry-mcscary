import Phaser from 'phaser'

export default class Win extends Phaser.Scene
{
	constructor()
	{
		super('welcome')
	}

	preload()
    {
        this.load.image('background', 'assets/backgrounds/menu.png');
        this.load.image('onePlayer', 'assets/welcome/player.png');
        this.load.image('twoPlayer', 'assets/welcome/player.png');
        this.load.image('threePlayer', 'assets/welcome/player.png');
    }

    create()
    {

        this.add.image(400, 300, 'background')

        let one = this.add.image(180, 300, 'onePlayer').setInteractive();
        let two = this.add.image(400, 300, 'twoPlayer').setInteractive();
        let three = this.add.image(620, 300, 'threePlayer').setInteractive();

	    one.on('pointerdown', (pointer) => this.selectPlayer(1));
	    two.on('pointerdown', (pointer) => this.selectPlayer(2));
	    three.on('pointerdown', (pointer) => this.selectPlayer(3));

    }

    selectPlayer(playerCount) {
    	this.scene.start('game', { playerCount: playerCount });
    	this.scale.startFullscreen()
    }
}

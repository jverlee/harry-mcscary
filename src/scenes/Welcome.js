import Phaser from 'phaser'

export default class Win extends Phaser.Scene
{
	constructor()
	{
		super('welcome')
        this.rankings = undefined;
	}

	preload()
    {
        this.load.image('background', 'assets/backgrounds/menu.png');
        this.load.image('onePlayer', 'assets/buttons/1player.png');
        this.load.image('twoPlayer', 'assets/buttons/2player.png');
        this.load.image('threePlayer', 'assets/buttons/3player.png');
        this.load.image('selectOption', 'assets/welcome/select-option.png');
    }

    create()
    {

        this.add.image(400, 300, 'background')

        let selectOption = this.add.image(390, 170, 'selectOption');
        let one = this.add.image(180, 400, 'onePlayer').setInteractive({ useHandCursor: true  });
        let two = this.add.image(400, 400, 'twoPlayer').setInteractive({ useHandCursor: true  });
        let three = this.add.image(620, 400, 'threePlayer').setInteractive({ useHandCursor: true  });

	    one.on('pointerdown', (pointer) => this.selectPlayer(1));
	    two.on('pointerdown', (pointer) => this.selectPlayer(2));
	    three.on('pointerdown', (pointer) => this.selectPlayer(3));

    }

    selectPlayer(playerCount) {
    	this.scene.start('game', { playerCount: playerCount });
    	this.scale.startFullscreen()
    }
}

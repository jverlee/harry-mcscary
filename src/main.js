import Phaser from 'phaser'

import HelloWorldScene from './scenes/HelloWorldScene'
import Game from './scenes/Game'
import Win from './scenes/Win'

const config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'phaser-example',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600
    },
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 300 },
			debug: false
		}
	},
	scene: [Game, Win]
}

export default new Phaser.Game(config)

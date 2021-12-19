import Phaser from 'phaser'

import HelloWorldScene from './scenes/HelloWorldScene'
import Game from './scenes/Game'

const config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 300 }
		}
	},
	scene: [Game]
}

export default new Phaser.Game(config)

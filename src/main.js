import Phaser from 'phaser'

import HelloWorldScene from './scenes/HelloWorldScene'
import Game from './scenes/Game'
import Complete from './scenes/Complete'
import Welcome from './scenes/Welcome'

const config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	parent: 'game',
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'phaser-example',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600
    },
    dom: {
        createContainer: true
    },
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 300 },
			debug: false
		}
	},
	scene: [Welcome, Game, Complete]
}

export default new Phaser.Game(config)

import Phaser from 'phaser'

export default class PlatformManager
{
	/**
	 * @param {Phaser.Scene} scene
	 */
	constructor(scene)
	{
		this.scene = scene

		this._group = this.scene.physics.add.group({
			immovable: true,
        	allowGravity: false
    	})
	}

	get group()
	{
		return this._group
	}

	create(x, y, key, world)
	{

        let platform = this.group.create(x, y, key).setSize(810, 20, false).setOffset(0, 54)

		let screenWidth = 800;
		let screenHeight = 600;
		let platformWidth = platform.width;
		let platformHeight = platform.height;
		let leftEdgeX = platform.x - (platformWidth/2)
		let rightEdgeX = platform.x + (platformWidth/2)

		if (leftEdgeX < 0 && rightEdgeX > screenWidth) { // full screen
			platform.minY = y;
			platform.maxY = screenHeight + platformHeight;
		} else if (leftEdgeX < 0) {
			platform.maxX = x;
			platform.minX = 0 - platformWidth;
			console.log(platform);
		} else if (rightEdgeX > screenWidth) {
			platform.maxX = screenWidth + platformWidth;
			platform.minX = x;
		}

		platform.world = world;

		return platform;

	}

	stopAtLimits(platform)
	{

		if (platform.body.velocity.x || platform.body.velocity.y) { // if it's moving

			if (
				platform.minX !== 'undefined' && // if min is set
				platform.minX >= platform.x && // and platform is less than or equal to min
				platform.body.velocity.x < 0 // and velocity is sending it left
				) {
				platform.setVelocityX(0)
			} else if (
				platform.maxX !== 'undefined' && // if max is set
				platform.maxX <= platform.x && // and platform is less than or equal to min
				platform.body.velocity.x > 0 // and velocity is sending it right
				) {
				platform.setVelocityX(0)
			} else if (
				platform.minY !== 'undefined' && // if min is set
				platform.minY >= platform.y && // and platform is less than or equal to min
				platform.body.velocity.y < 0 // and velocity is sending it right
				) {
				platform.setVelocityY(0)
			} else if (
				platform.maxY !== 'undefined' && // if min is set
				platform.maxY <= platform.y && // and platform is less than or equal to min
				platform.body.velocity.y > 0 // and velocity is sending it right
				) {
				platform.setVelocityY(0)
			}

		}

	}

	toggleWorld(world, action)
	{

		this.group.children.iterate((platform, index) => {

			if (action == 'hide') {
				if (platform.minX || platform.maxX) {
					(platform.x < 400) ? platform.setVelocityX(-150) : platform.setVelocityX(150)
				} else if (platform.minY || platform.maxY) {
					(platform.y < 300) ? platform.setVelocityY(-100) : platform.setVelocityY(100)
				}
			} else {
				if (platform.minX || platform.maxX) {
					(platform.x < 400) ? platform.setVelocityX(150) : platform.setVelocityX(-150)
				} else if (platform.minY || platform.maxY) {
					(platform.y > 300) ? platform.setVelocityY(-100) : platform.setVelocityY(100);
				}
			}
			
		})

	}

}
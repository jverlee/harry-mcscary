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

	createPlatform(x, y, key, world)
	{

        let platform = this.group
        	.create(x, y, key)
        	.setSize(
        		this.getSizeByKey(key).size.x,
        		this.getSizeByKey(key).size.y,
        		false
        		)
        	.setOffset(
        		this.getSizeByKey(key).offset.x, 
        		this.getSizeByKey(key).offset.y
        		);

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
		} else if (rightEdgeX > screenWidth) {
			platform.maxX = screenWidth + platformWidth;
			platform.minX = x;
		}

		platform.world = world;

		return platform;

	}

	getSizeByKey(key)
	{
		switch (key) {

			case "meadowsPlatform":
				return { size: { x: 810, y: 20 }, offset: { x: 0, y: 54 } }
				break;

			case "cavePlatform":
				return { size: { x: 810, y: 20 }, offset: { x: 0, y: 27 } }
				break;

			case "icePlatform":
				return { size: { x: 711, y: 20 }, offset: { x: 0, y: 27 } }
				break;

			case "iceBasePlatform":
				return { size: { x: 810, y: 20 }, offset: { x: 0, y: 33 } }
				break;

			case "lavaPlatform":
				return { size: { x: 790, y: 20 }, offset: { x: 20, y: 18 } }
				break;

			default:
				return { size: { x: 810, y: 20 }, offset: { x: 0, y: 0 } }
				break;

		}
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

	createWorld(world, isVisible = true)
	{

		switch(world) {

			case "meadows":
		    	this.createPlatform(400, 550, 'meadowsPlatform', 'meadows').setVisible(isVisible);
		    	this.createPlatform(880, 400, 'meadowsPlatform', 'meadows').setVisible(isVisible);
		    	this.createPlatform(-80, 250, 'meadowsPlatform', 'meadows').setVisible(isVisible);
		    	this.createPlatform(1000, 220, 'meadowsPlatform', 'meadows').setVisible(isVisible);
				break;

			case "cave":
		    	this.createPlatform(400, 550, 'cavePlatform', 'cave').setVisible(isVisible);
		    	this.createPlatform(880, 400, 'cavePlatform', 'cave').setVisible(isVisible);
		    	this.createPlatform(-80, 250, 'cavePlatform', 'cave').setVisible(isVisible);
		    	this.createPlatform(1000, 220, 'cavePlatform', 'cave').setVisible(isVisible);
				break;

			case "ice":
		    	this.createPlatform(400, 550, 'iceBasePlatform', 'ice').setVisible(isVisible);
		    	this.createPlatform(880, 400, 'icePlatform', 'ice').setVisible(isVisible);
		    	this.createPlatform(-80, 250, 'icePlatform', 'ice').setVisible(isVisible);
		    	this.createPlatform(1000, 220, 'icePlatform', 'ice').setVisible(isVisible);			
				break;

			case "lava":
		    	this.createPlatform(400, 550, 'lavaPlatform', 'lava').setVisible(isVisible);
		    	this.createPlatform(880, 400, 'lavaPlatform', 'lava').setVisible(isVisible);
		    	this.createPlatform(-80, 250, 'lavaPlatform', 'lava').setVisible(isVisible);
		    	this.createPlatform(1000, 220, 'lavaPlatform', 'lava').setVisible(isVisible);			
				break;

		}

		// hide if not visible
		if (!isVisible) { this.toggleWorld(world, 'hide'); }

	}

	toggleWorld(world, action)
	{

		// update background
		if (action == 'show') {

			switch(world) {
				case "meadows":
					this.scene.bg.setTexture('meadowsBg');
					break;
				case "cave":
					this.scene.bg.setTexture('caveBg');
					break;
				case "ice":
					this.scene.bg.setTexture('iceBg');
					break;
				case "lava":
					this.scene.bg.setTexture('lavaBg');
					break;
			}

		}

		// show/hide platforms
		this.group.children.iterate((platform, index) => {

			if(platform.world == world) {

				if (action == 'hide') {
					if (platform.minX || platform.maxX) {
						(platform.x < 400) ? platform.setVelocityX(-150) : platform.setVelocityX(150)
					} else if (platform.minY || platform.maxY) {
						(platform.y < 300) ? platform.setVelocityY(-100) : platform.setVelocityY(100)
					}
				} else {
					platform.setVisible(true); // ensure it's visible
					if (platform.minX || platform.maxX) {
						(platform.x < 400) ? platform.setVelocityX(150) : platform.setVelocityX(-150)
					} else if (platform.minY || platform.maxY) {
						(platform.y > 300) ? platform.setVelocityY(-100) : platform.setVelocityY(100);
					}
				}

			}
			
		})

	}

}
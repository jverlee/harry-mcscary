import Phaser from 'phaser'

const formatLevel = (level) => `Level: ${level}`

export default class LevelLabel extends Phaser.GameObjects.Text
{
	constructor(scene, x, y, level, style)
	{
		super(scene, x, y, formatLevel(level), style)

		this.level = level
	}

	setLevel(level)
	{
		this.level = level
		this.updateLevelText()
	}

	add()
	{
		this.setLevel(this.level + 1)
	}

	updateLevelText()
	{
		this.setText(formatLevel(this.level))
	}

	getWorldByLevel(level)
	{
		switch(level) {
			case 1:
				return "meadows";
				break;
			case 2:
				return "cave";
				break;
			case 3:
				return "ice";
				break;
			case 4:
				return "lava";
				break;
		}
	}

}
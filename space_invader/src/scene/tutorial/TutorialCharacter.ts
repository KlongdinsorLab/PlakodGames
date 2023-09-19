import Phaser from 'phaser'
import { Meteor } from 'component/enemy/Meteor'
import Player from 'component/player/Player'
import { DESTROY_METEOR_SCORE, HIT_METEOR_SCORE, MARGIN } from 'config'
import I18nSingleton from 'i18n/I18nSingleton'
import SoundManager from 'component/sound/SoundManager'

export type Character = {
	meteor: Meteor
	player: Player
}

export default class TutorialCharacterScene extends Phaser.Scene {
	private meteor!: Meteor
	private player!: Player

	constructor() {
		super('tutorial character')
	}

	init({ meteor, player }: Character) {
		this.meteor = meteor
		this.player = player
	}

	create() {
		const soundManager = new SoundManager(this)
		const isMute = soundManager.isMute()
		soundManager.mute()

		const { width, height } = this.scale
		this.add.rectangle(0, 0, width, height, 0, 0.5).setOrigin(0, 0)

		const i18n = I18nSingleton.getInstance()

		const meteor = this.meteor.getBody()
		const meterHighlight = this.add
			.rectangle(
				meteor.x,
				meteor.y,
				meteor.width + MARGIN / 2,
				meteor.height + MARGIN,
			)
			.setOrigin(0.5, 0.5)
		meterHighlight.setStrokeStyle(4, 0xffffff)
		i18n
			.createTranslatedText(
				this,
				meteor.x + meteor.width / 2 + MARGIN / 2,
				meteor.y - meteor.height / 2,
				'tutorial_enemy_title',
				undefined,
				{ fontSize: '32px' },
			)
			.setOrigin(0, 0.5)
		i18n
			.createTranslatedText(
				this,
				meteor.x + meteor.width / 2 + MARGIN / 2,
				meteor.y - meteor.height / 2 + MARGIN / 2,
				'tutorial_enemy_description',
				{ score: HIT_METEOR_SCORE },
				{ wordWrap: { width: width / 2 }, fontSize: '22px' },
			)
			.setOrigin(0, 0)

		const player = this.player.getBody()
		const playerHighlight = this.add
			.rectangle(
				player.x,
				player.y,
				player.width + MARGIN / 2,
				player.height + MARGIN,
			)
			.setOrigin(0.5, 0.5)
		playerHighlight.setStrokeStyle(4, 0xffffff)
		i18n
			.createTranslatedText(
				this,
				player.x + player.width / 2 + MARGIN / 2,
				player.y - player.height / 2,
				'tutorial_player_title',
				undefined,
				{ fontSize: '32px' },
			)
			.setOrigin(0, 0.5)
		i18n
			.createTranslatedText(
				this,
				player.x + player.width / 2 + MARGIN / 2,
				player.y - player.height / 2 + MARGIN / 2,
				'tutorial_player_description',
				{ score: DESTROY_METEOR_SCORE },
				{ wordWrap: { width: width / 2 - player.width }, fontSize: '22px' },
			)
			.setOrigin(0, 0)

		this.input.once(
			'pointerdown',
			() => {
				this.scene.resume('game')
				isMute ? soundManager.mute() : soundManager.unmute()
				i18n.removeAllListeners(this)
				this.scene.stop()
			},
			this,
		)
	}
}

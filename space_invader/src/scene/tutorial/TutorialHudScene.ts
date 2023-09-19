import Phaser from 'phaser'
import Score from 'component/ui/Score'
import InhaleGauge from 'component/ui/InhaleGauge'
import ReloadCount from 'component/ui/ReloadCount'
import I18nSingleton from 'i18n/I18nSingleton'
import Menu from 'component/ui/Menu'
import { CIRCLE_GAUGE_RADUIS, HOLD_BAR_HEIGHT, MARGIN } from 'config'
import SoundManager from "component/sound/SoundManager";

export type Hud = {
	score: Score
	gauge: InhaleGauge
	menu: Menu
	reloadCount: ReloadCount
}

export default class TutorialHudScene extends Phaser.Scene {
	private score!: Score
	private gauge!: InhaleGauge
	private menu!: Menu
	private reloadCount!: ReloadCount

	constructor() {
		super('tutorial HUD')
	}

	init({ score, gauge, menu, reloadCount }: Hud) {
		this.score = score
		this.gauge = gauge
		this.reloadCount = reloadCount
		this.menu = menu
	}

	create() {
		const soundManager = new SoundManager(this)
		const isMute = soundManager.isMute()
		soundManager.mute()

		const { width, height } = this.scale
		this.add.rectangle(0, 0, width, height, 0, 0.5).setOrigin(0, 0)

		const i18n = I18nSingleton.getInstance()

		// score
		const score = this.score.getBody()
		const scoreHighlight = this.add
			.rectangle(
				score.x + score.width / 2,
				score.y + score.height / 2,
				score.width + MARGIN,
				score.height + MARGIN,
			)
			.setOrigin(0.5, 0.5)
		scoreHighlight.setStrokeStyle(4, 0xffffff)
		i18n
			.createTranslatedText(
				this,
				scoreHighlight.x - scoreHighlight.width / 2,
				score.y + scoreHighlight.height,
				'tutorial_score_title',
				undefined,
				{ fontSize: '22px' },
			)
			.setOrigin(0, 0)

		// reload
		const reloadCount = this.reloadCount.getBody()
		const reloadHighlight = this.add
			.rectangle(
				reloadCount.x,
				reloadCount.y + reloadCount.height / 2,
				reloadCount.width + MARGIN,
				reloadCount.height + MARGIN,
			)
			.setOrigin(0.5, 0.5)
		reloadHighlight.setStrokeStyle(4, 0xffffff)

		i18n
			.createTranslatedText(
				this,
				reloadCount.x - reloadHighlight.width / 2,
				score.y + scoreHighlight.height,
				'tutorial_reload_title',
				undefined,
				{ wordWrap: { width: reloadHighlight.width }, fontSize: '22px' },
			)
			.setOrigin(0, 0)

		// menu
		const menu = this.menu.getBody()
		const menuHighlight = this.add
			.rectangle(
				menu.x - menu.width / 4,
				menu.y + menu.height / 4,
				menu.width / 2,
				menu.height / 2,
			)
			.setOrigin(0.5, 0.5)
		menuHighlight.setStrokeStyle(4, 0xffffff)

		i18n
			.createTranslatedText(
				this,
				menuHighlight.x + menuHighlight.width / 2,
				score.y + scoreHighlight.height,
				'tutorial_menu_title',
				undefined,
				{ wordWrap: { width: menu.width / 2 }, fontSize: '22px' },
			)
			.setOrigin(1, 0)

		// Gauge
		const gauge = this.gauge.getBody()
		let gaugeWidth = width - MARGIN
		let gaugeHeight = HOLD_BAR_HEIGHT
		if (gauge instanceof Phaser.GameObjects.Arc) {
			gaugeWidth = 2 * CIRCLE_GAUGE_RADUIS
			gaugeHeight = 2 * CIRCLE_GAUGE_RADUIS
		}
		const gaugeHighlight = this.add
			.rectangle(width / 2, gauge.y + gaugeHeight / 2, gaugeWidth, gaugeHeight)
			.setOrigin(0.5, 1)
		gaugeHighlight.setStrokeStyle(4, 0xffffff)

		const gaugeDescription = i18n
			.createTranslatedText(
				this,
				gaugeHighlight.x,
				gaugeHighlight.y - gaugeHighlight.height - MARGIN,
				'tutorial_gauge_description',
				undefined,
				{ wordWrap: { width: width / 2 }, fontSize: '22px' },
			)
			.setOrigin(0.5, 1)

		i18n
			.createTranslatedText(
				this,
				gaugeDescription.x,
				gaugeDescription.y - gaugeDescription.height - MARGIN / 2,
				'tutorial_gauge_title',
				undefined,
				{ wordWrap: { width: width / 2 }, fontSize: '32px' },
			)
			.setOrigin(0.5, 1)

		this.input.once(
			'pointerdown',
			() => {
				this.scene.resume('game')
				this.scene.setVisible(false)
				isMute ? soundManager.mute() : soundManager.unmute()
			},
			this,
		)
	}
}

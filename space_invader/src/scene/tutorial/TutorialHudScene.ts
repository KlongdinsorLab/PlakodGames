import Phaser from 'phaser'
import Score from 'component/ui/Score'
import InhaleGauge from 'component/ui/InhaleGauge'
import ReloadCount from 'component/ui/ReloadCount'
import I18nSingleton from 'i18n/I18nSingleton'
import Menu from 'component/ui/Menu'
import {
  CIRCLE_GAUGE_RADUIS,
  HOLD_BAR_HEIGHT,
  LARGE_FONT_SIZE,
  MARGIN,
  MEDIUM_FONT_SIZE,
  TUTORIAL_DELAY_MS,
} from 'config'
import SoundManager from 'component/sound/SoundManager'
import WebFont from 'webfontloader'

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
    const scoreLayer = this.add.layer();
    this.score.getLayer().getAll().forEach(
      layer => scoreLayer.add(layer)
    )

    i18n
      .createTranslatedText(
        this,
        score.x - score.width / 2,
        score.y + score.height,
        'tutorial_score_title',
      )
      .setFontSize(MEDIUM_FONT_SIZE)
      .setOrigin(0, 0)

    // reload
    const reloadCount = this.reloadCount.getBody()
    const reloadLayer = this.add.layer();
    this.reloadCount.getLayer().getAll().forEach(
      layer => reloadLayer.add(layer)
    )

    i18n
      .createTranslatedText(
        this,
        reloadCount.x - reloadCount.width / 2,
        score.y + score.height,
        'tutorial_reload_title',
        undefined,
        {
          wordWrap: { width: reloadCount.width },
          fontSize: MEDIUM_FONT_SIZE,
        },
      )
      .setOrigin(0, 0)

    // menu
    const menu = this.menu.getBody()
    const tutorialLayer = this.add.layer();
    tutorialLayer.add(menu)

    i18n
      .createTranslatedText(
        this,
        menu.x,
        score.y + score.height,
        'tutorial_menu_title',
        undefined,
        { wordWrap: { width: menu.width / 2 }, fontSize: MEDIUM_FONT_SIZE },
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
        { wordWrap: { width: width / 2 }, fontSize: MEDIUM_FONT_SIZE },
      )
      .setOrigin(0.5, 1)

    i18n
      .createTranslatedText(
        this,
        gaugeDescription.x,
        gaugeDescription.y - gaugeDescription.height - MARGIN / 2,
        'tutorial_gauge_title',
        undefined,
        { wordWrap: { width: width / 2 }, fontSize: LARGE_FONT_SIZE },
      )
      .setOrigin(0.5, 1)

    const continueText = i18n
      .createTranslatedText(this, width / 2, height / 2, 'tutorial_continue')
      .setFontSize(MEDIUM_FONT_SIZE)
      .setOrigin(0.5, 0)
      .setAlpha(0)
    const continueImage = this.add.image(width / 2, height / 2 - continueText.height - MARGIN / 2, 'ui', 'touch.png')
      .setAlpha(0)

    this.tweens.add({
      targets: continueText,
      alpha: 1,
      duration: TUTORIAL_DELAY_MS,
      repeat: 0,
      ease: 'sine.in',
    })

    this.tweens.add({
      targets: continueImage,
      alpha: 1,
      duration: TUTORIAL_DELAY_MS,
      repeat: 0,
      ease: 'sine.in',
    })

    this.tweens.add({
      targets: continueImage,
      scale: 1.25,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    })

    WebFont.load({
      google: {
        families: ['Mali']
      },
      active: function() {
        const tutorialUiStyle = {
          fontFamily: 'Mali'
        }
        // meteorTitle.setStyle(tutorialUiStyle)
        // meteorDescription.setStyle(tutorialUiStyle)
        // playerTitle.setStyle(tutorialUiStyle)
        // playerDescription.setStyle(tutorialUiStyle)
        continueText.setStyle(tutorialUiStyle)
      }
    });

    const self = this
    setTimeout(() => {
      self.input.once(
        'pointerdown',
        () => {
          scoreLayer.getAll().forEach(
            layer => this.score.getLayer().add(layer)
          )
          reloadLayer.getAll().forEach(
            layer => this.reloadCount.getLayer().add(layer)
          )
          this.menu.getLayer().add(menu)
          self.scene.resume('game')
          isMute ? soundManager.mute() : soundManager.unmute()
          i18n.removeAllListeners(self)
          self.scene.stop()
        },
        this,
      )
    }, 2000)
  }

  // 		this.input.once(
  // 			'pointerdown',
  // 			() => {
  // 				this.scene.resume('game')
  // 				isMute ? soundManager.mute() : soundManager.unmute()
  // 				i18n.removeAllListeners(this)
  // 				this.scene.stop()
  // 			},
  // 			this,
  // 		)
  // 	}
}

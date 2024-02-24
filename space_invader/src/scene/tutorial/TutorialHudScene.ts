import SoundManager from 'component/sound/SoundManager'
import InhaleGauge from 'component/ui/InhaleGauge'
import Menu from 'component/ui/Menu'
import ReloadCount from 'component/ui/ReloadCount'
import Score from 'component/ui/Score'
import {
  DARK_ORANGE,
  DARK_PURPLE,
  LARGE_FONT_SIZE,
  MARGIN,
  MEDIUM_FONT_SIZE,
  TUTORIAL_DELAY_MS
} from 'config'
import I18nSingleton from 'i18n/I18nSingleton'
import Phaser from 'phaser'
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

  preload() {
    this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
    this.load.atlas('warmup', 'assets/sprites/warmup/warmup_all.png', 'assets/sprites/warmup/warmup_all.json');
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

    const scoreBackground = this.add.image(
      score.x,
      score.y + score.height + MARGIN / 2,
      'ui',
      'purple bubble.png'
    ).setOrigin(0.5, 0)
    const scoreTutorial = i18n
      .createTranslatedText(
        this,
        scoreBackground.x - MARGIN - 16,
        scoreBackground.y + MARGIN - 8,
        'tutorial_score_title',
      )
      .setFontSize(MEDIUM_FONT_SIZE)
      .setColor(`#${DARK_PURPLE.toString(16)}`)
      .setOrigin(0, 0)

    // reload
    const reloadCount = this.reloadCount.getBody()
    const reloadLayer = this.add.layer();
    this.reloadCount.getLayer().getAll().forEach(
      layer => reloadLayer.add(layer)
    )

    const reloadBackground = this.add.image(
      reloadCount.x,
      reloadCount.y + score.height + MARGIN / 2,
      'ui',
      'purple bubble.png'
    ).setOrigin(1, 0)
    const reloadTutorial = i18n
      .createTranslatedText(
        this,
        reloadBackground.x - MARGIN / 2,
        reloadBackground.y + MARGIN - 8,
        'tutorial_reload_title',
        undefined,
        {
          wordWrap: { width: reloadCount.width },
        },
      )
      .setFontSize(MEDIUM_FONT_SIZE)
      .setColor(`#${DARK_PURPLE.toString(16)}`)
      .setOrigin(1, 0)

    // menu
    const menu = this.menu.getBody()
    const tutorialLayer = this.add.layer();
    tutorialLayer.add(menu)

    const menuBackground = this.add.image(menu.x, score.y + score.height + MARGIN / 2, 'ui', 'purple bubble.png')
      .setOrigin(1, 0)

    const menuTutorial = i18n
      .createTranslatedText(
        this,
        menuBackground.x - MARGIN / 2,
        menuBackground.y + MARGIN - 8,
        'tutorial_menu_title',
        undefined,
        { wordWrap: { width: menu.width / 2 } },
      )
      .setFontSize(MEDIUM_FONT_SIZE)
      .setColor(`#${DARK_PURPLE.toString(16)}`)
      .setOrigin(1, 0)

    // Gauge
    const gauge = this.gauge.getBody()
    const gaugeBox = this.add.nineslice(
      gauge.x,
      gauge.y - MARGIN,
      'ui',
      'orange bubble.png',
      480, 240, 36, 112, 36, 56
    ).setOrigin(0.5, 1)
    const gaugeTitle = i18n
      .createTranslatedText(
        this,
        gaugeBox.x,
        gaugeBox.y - gaugeBox.height + MARGIN / 2,
        'tutorial_gauge_title',
      )
      .setColor(`#${DARK_ORANGE.toString(16)}`)
      .setFontSize(LARGE_FONT_SIZE)
      .setOrigin(0.5, 0)
    i18n
      .createTranslatedText(
        this,
        gaugeTitle.x,
        gaugeTitle.y + gaugeTitle.height,
        'tutorial_gauge_description',
      )
      .setWordWrapWidth(gaugeBox.width + MARGIN)
      .setColor(`#${DARK_ORANGE.toString(16)}`)
      .setFontSize(MEDIUM_FONT_SIZE)
      .setOrigin(0.5, 0)

    this.anims.create({
      key: 'inhale-animation',
      frames: this.anims.generateFrameNames('warmup', {
        prefix: 'warmup_inhale_', suffix: '.png', start: 0, end: 30, zeroPad: 5
      }),
      frameRate: 24,
      repeat: -1,
    })

    this.physics.add.sprite(
      gaugeBox.x - 2 * MARGIN,
      gaugeBox.y - gaugeBox.height + 2 * MARGIN,
      'inhale',
    )
      .setScale(0.4)
      .setOrigin(1, 1)
      .play('inhale-animation')

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

    const pressAnim = this.tweens.add({
      targets: continueImage,
      scale: 1.25,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    })
    pressAnim.pause()

    WebFont.load({
      google: {
        families: ['Mali']
      },
      active: function() {
        const tutorialUiStyle = {
          fontFamily: 'Mali'
        }
        scoreTutorial.setStyle(tutorialUiStyle)
        reloadTutorial.setStyle(tutorialUiStyle)
        menuTutorial.setStyle(tutorialUiStyle)
        continueText.setStyle(tutorialUiStyle)
      }
    });

    const self = this
    setTimeout(() => {
      pressAnim.resume()
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

}

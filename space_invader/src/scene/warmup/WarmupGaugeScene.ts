import Phaser from 'phaser'
import { BULLET_COUNT, DARK_ORANGE, GREEN, LASER_FREQUENCY_MS, MARGIN, PLAYER_START_MARGIN, TUTORIAL_DELAY_MS } from 'config'
import I18nSingleton from 'i18n/I18nSingleton'
import EventEmitter = Phaser.Events.EventEmitter
import WebFont from 'webfontloader'

export default class WarmupScene extends Phaser.Scene {
  private event!: EventEmitter

  constructor() {
    super('warmupGauge')
  }

  preload() {
    this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
    this.load.atlas('ui', 'assets/sprites/warmup/warmup_all.png', 'assets/sprites/warmup/warmup_all.json');
  }

  init({ event }: { event: EventEmitter }) {
    this.event = event
  }

  create() {
    const { width, height } = this.scale
    const inhaleText1 =I18nSingleton
      .getInstance()
      .createTranslatedText(this, width/2, 4 * MARGIN, 'tutorial_inhale_1')
      .setOrigin(0.5, 0)

    const inhaleText2 = I18nSingleton
      .getInstance()
      .createTranslatedText(this, width/2, inhaleText1.y + 2 * inhaleText1.height + 2 * MARGIN, 'tutorial_inhale_2')
      .setOrigin(0.5, 0)

    const arrow = this.add.image(width/2, height - PLAYER_START_MARGIN + 2 * MARGIN, 'ui', 'arrow.png').setOrigin(0.5, 1);
    arrow.setVisible(false)

    WebFont.load({
      google: {
        families: ['Mali']
      },
      active: function() {
        const warmupUiStyle = {
          fontFamily: 'Mali'
        }

        inhaleText1.setStyle({
          ...warmupUiStyle,
          color: 'white',
          fontWeight: 700
        })
          .setFontSize('8em')
          .setStroke('#58595B', 16);


        inhaleText2.setStyle({
          ...warmupUiStyle,
          color: `#${GREEN.toString(16).padStart(6, '0')}`,
          fontWeight: 700
        })
          .setFontSize('8em')
          .setStroke('#58595B', 16);
      }
    });

    this.event.once('fullInhale', () => {
      this.event.removeListener('fullInhale')
      I18nSingleton.getInstance().setTranslatedText(inhaleText1, 'tutorial_attack_1')
      I18nSingleton.getInstance().setTranslatedText(inhaleText2, 'tutorial_attack_2')
      inhaleText2.setColor('white')
      arrow.setVisible(true)

      setTimeout(()=> {
        I18nSingleton.getInstance().setTranslatedText(inhaleText1, 'tutorial_start_game')
        arrow.setVisible(false)
        inhaleText1.setY(height / 2)
        this.tweens.add({
          targets: inhaleText1,
          alpha: 0,
          scale: 2,
          ease: 'back.in',
          duration: TUTORIAL_DELAY_MS,
          onComplete: () => {
            this.scene.setVisible(false)
          }
        })
        inhaleText2.setVisible(false)
        inhaleText1
          .setColor(`#${DARK_ORANGE.toString(16)}`)
          .setFontSize('7.5em')
          .setStroke('white', 16);
      }, LASER_FREQUENCY_MS * BULLET_COUNT)

    })
  }
}

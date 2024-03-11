import Phaser from 'phaser'
import { DARK_ORANGE, LARGE_FONT_SIZE, MARGIN, TUTORIAL_DELAY_MS } from 'config'
import I18nSingleton from 'i18n/I18nSingleton'
import EventEmitter = Phaser.Events.EventEmitter
import WebFont from 'webfontloader'

export enum Step {
  EXHALE = 0,
  RELEASE = 1,
  INHALE = 2,
}

export default class WarmupScene extends Phaser.Scene {
  private event!: EventEmitter
  private step: Step = Step.EXHALE
  private exhaleSprite!: Phaser.GameObjects.Sprite

  constructor() {
    super('warmup')
  }

  preload() {
    this.load.atlas('warmup', 'assets/sprites/warmup/warmup_spritesheet.png', 'assets/sprites/warmup/warmup_spritesheet.json');
    this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
  }

  init({ event }: { event: EventEmitter }) {
    this.event = event
  }

  create() {
    const self = this
    WebFont.load({
      google: {
        families: ['Mali']
      },
      active: function() {
        const { width, height } = self.scale
        self.add.rectangle(0, 0, width, height, 0, 0.5).setOrigin(0, 0)

        self.anims.create({
          key: 'exhale-animation',
          frames: self.anims.generateFrameNames('warmup', {
            prefix: 'tt_exhale_', suffix: '.png', start: 1, end: 12, zeroPad: 5
          }),
          frameRate: 18,
          // repeat: -1,
        })

        self.anims.create({
          key: 'hold-animation',
          frames: self.anims.generateFrameNames('warmup', {
            prefix: 'tt_pick_', suffix: '.png', start: 1, end: 12, zeroPad: 5
          }),
          frameRate: 18,
          // repeat: -1,
        })

        self.anims.create({
          key: 'inhale-animation',
          frames: self.anims.generateFrameNames('warmup', {
            prefix: 'tt_inhale_', suffix: '.png', start: 1, end: 12, zeroPad: 5
          }),
          frameRate: 18,
          // repeat: -1,
        })

        const spriteX = width / 2
        const spriteY = height / 2 - 2 * MARGIN

        const exhaleSprite = self.physics.add.sprite(spriteX, spriteY, 'warmup')
        exhaleSprite.play('hold-animation')

        const descriptionY = exhaleSprite.y - exhaleSprite.height / 4 - 4 * MARGIN

        const i18n = I18nSingleton.getInstance()
        const description = i18n
          .createTranslatedText(
            self,
            width / 2,
            descriptionY,
            'warmup_hold',
          )
          .setWordWrapWidth(width / 2)
          .setFontSize(LARGE_FONT_SIZE)
          .setAlign('center')
          .setOrigin(0.5, 0.5)

        const exhale = i18n
          .createTranslatedText(
            self,
            width / 2,
            height - 6 * MARGIN,
            'exhale',
          )
          .setWordWrapWidth(width / 2)
          .setOrigin(0.5, 0.5)

        exhale.setVisible(false)

        setTimeout(() => {
          exhaleSprite.setVisible(false)
          i18n.setTranslatedText(description, 'warmup_exhale')

          self.exhaleSprite = self.add.sprite(spriteX, spriteY, 'release')
          self.exhaleSprite.play('exhale-animation')
          self.exhaleSprite.setDepth(1)
          self.step = Step.RELEASE
          exhale.setVisible(true)

          self.tweens.add({
            targets: exhale,
            scale: 3,
            startDelay: 2000,
            duration: TUTORIAL_DELAY_MS,
            ease: 'Sine.inOut',
            onComplete: (tween) => {
              if (self.step === Step.INHALE) return
              (tween.targets[0] as Phaser.GameObjects.Text).setVisible(false)
              description.setVisible(false)
              self.scene.resume('game')
              self.exhaleSprite.setVisible(false)

              i18n.setTranslatedText(exhale, 'inhale')
              tween.restart()
              exhale.setVisible(true)

              const inhaleSprite = self.add.sprite(spriteX, spriteY, 'inhale')
              inhaleSprite.play('inhale-animation')
              inhaleSprite.setDepth(1)
              self.step = Step.INHALE
            },
          })
        }, TUTORIAL_DELAY_MS)


        const warmupUiStyle = {
          fontFamily: 'Mali'
        }
        description.setStyle(warmupUiStyle)
        exhale.setStyle({
          ...warmupUiStyle,
          color: `#${DARK_ORANGE.toString(16)}`,
          fontWeight: 700
        })
          .setFontSize('7.5em')
          .setStroke('white', 16);
      }
    });

    this.event.once('inhale', () => {
      this.scene.setVisible(false)
      this.event.removeListener('inhale')
      this.scene.launch('warmupGauge', { event: this.event })
    })
  }
}

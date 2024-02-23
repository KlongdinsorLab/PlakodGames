import { Meteor } from 'component/enemy/Meteor'
import Player from 'component/player/Player'
import SoundManager from 'component/sound/SoundManager'
import {
  DARK_ORANGE,
  DARK_PURPLE,
  DESTROY_METEOR_SCORE,
  HIT_METEOR_SCORE,
  LARGE_FONT_SIZE,
  MARGIN,
  MEDIUM_FONT_SIZE,
  TUTORIAL_DELAY_MS
} from 'config'
import I18nSingleton from 'i18n/I18nSingleton'
import Phaser from 'phaser'
import WebFont from 'webfontloader'

export type Character = {
  meteor: Meteor
  player: Player
  gameLayer: Phaser.GameObjects.Layer
}

export default class TutorialCharacterScene extends Phaser.Scene {
  private meteor!: Meteor
  private player!: Player
  private gameLayer!: Phaser.GameObjects.Layer

  constructor() {
    super('tutorial character')
  }

  init({ meteor, player, gameLayer }: Character) {
    this.meteor = meteor
    this.player = player
    this.gameLayer = gameLayer
  }

  preload() {
    this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
  }

  create() {
    const soundManager = new SoundManager(this)
    const isMute = soundManager.isMute()
    soundManager.mute()

    const { width, height } = this.scale
    this.add.rectangle(0, 0, width, height, 0, 0.5).setOrigin(0, 0)
    const tutorialLayer = this.add.layer();

    const i18n = I18nSingleton.getInstance()

    const meteor = this.meteor.getBody()
    tutorialLayer.add(meteor)

    const meteorBoxWidth = 400
    this.add.nineslice(
      meteor.x + MARGIN,
      meteor.y,
      'ui',
      'side purple bubble.png',
      meteorBoxWidth, 200, 56, 36, 36, 112
    ).setOrigin(0, 0.5)

    const meteorTitle = i18n
      .createTranslatedText(
        this,
        meteor.x + meteor.width + 2 * MARGIN,
        meteor.y - meteor.height / 2,
        'tutorial_enemy_title',
        null,
        { color: `#${DARK_PURPLE.toString(16)}` }
      )
      .setFontSize(LARGE_FONT_SIZE)
      .setOrigin(0, 0.5)
    const meteorDescription = i18n
      .createTranslatedText(
        this,
        meteor.x + meteor.width,
        meteor.y - meteor.height / 2 + MARGIN / 2,
        'tutorial_enemy_description',
        { score: HIT_METEOR_SCORE },
        {
          wordWrap: { width: width / 2 }, fontSize: MEDIUM_FONT_SIZE,
          color: `#${DARK_PURPLE.toString(16)}`
        },
      )
      .setOrigin(0, 0)

    const player = this.player.getBody()
    tutorialLayer.add(player)

    const playerBox = this.add.nineslice(
      player.x,
      player.y - player.height / 2,
      'ui',
      'orange bubble.png',
      480, 240, 36, 112, 36, 56
    ).setOrigin(0.5, 1)
    const playerTitle = i18n
      .createTranslatedText(
        this,
        playerBox.x,
        playerBox.y - playerBox.height + MARGIN / 2,
        'tutorial_player_title',
        null,
        { color: `#${DARK_ORANGE.toString(16)}` }
      )
      .setFontSize(LARGE_FONT_SIZE)
      .setOrigin(0.5, 0)
    const playerDescription = i18n
      .createTranslatedText(
        this,
        playerTitle.x,
        playerTitle.y + playerTitle.height,
        'tutorial_player_description',
        { score: DESTROY_METEOR_SCORE },
        {
          wordWrap: { width: playerBox.width + MARGIN },
          fontSize: MEDIUM_FONT_SIZE, color: `#${DARK_ORANGE.toString(16)}`
        },
      )
      .setOrigin(0.5, 0)

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
        meteorTitle.setStyle(tutorialUiStyle)
        meteorDescription.setStyle(tutorialUiStyle)
        playerTitle.setStyle(tutorialUiStyle)
        playerDescription.setStyle(tutorialUiStyle)
        continueText.setStyle(tutorialUiStyle)
      }
    });

    const self = this
    setTimeout(() => {
      self.input.once(
        'pointerdown',
        () => {
          self.gameLayer.add(player)
          self.gameLayer.add(meteor)
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

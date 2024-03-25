import Phaser from 'phaser'
import { MARGIN } from 'config'
import I18nSingleton from 'i18n/I18nSingleton'
import WebFont from 'webfontloader'
import { BossTutorialScene } from 'component/enemy/boss/Boss'
import SoundManager from 'component/sound/SoundManager'

export default class BossItemTutorial extends Phaser.Scene {

  constructor() {
    super(BossTutorialScene.COLLECT_ITEM)
  }

  preload() {
    this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');

    this.load.atlas('bossAsset', 'assets/sprites/boss/asset_boss.png', 'assets/sprites/boss/asset_boss.json');
    this.load.audio('bossItem', 'sound/boss-item.mp3')
  }

  create() {
    const { width, height } = this.scale

    const soundManager = new SoundManager(this)
	  const bossItem = this.sound.add('bossItem')
    soundManager.play(bossItem, false)

    const avoidText =I18nSingleton
      .getInstance()
      .createTranslatedText(this, width/2, 10 * MARGIN, 'avoid_poison')
      .setOrigin(0.5, 0)
    const bulletText =I18nSingleton
        .getInstance()
        .createTranslatedText(this, width/2, 18 * MARGIN, 'collect_bullet')
        .setOrigin(0.5, 0)

    // const arrow = this.add.image(width/2, height - PLAYER_START_MARGIN + 2 * MARGIN, 'bossAsset', 'arrow.png').setOrigin(0.5, 1);
    const poison = this.add.image(width/2, 9 * MARGIN, 'bossAsset', 'item_poison.png').setOrigin(0.5, 1);
    const bullet = this.add.image(width/2, 17 * MARGIN, 'bossAsset', 'item_bullet.png').setOrigin(0.5, 1);


    const poisonBox = this.add.graphics().lineStyle(8,0xFB511C,1).strokeRoundedRect(width/3, 6 * MARGIN + 8, width/3, height/8, 32);
    const bulletBox = this.add.graphics().lineStyle(8,0x7EAF08,1).strokeRoundedRect(width/3 , 14 * MARGIN + 8, width/3, height/8, 32);

    WebFont.load({
      google: {
        families: ['Mali']
      },
      active: function() {
        const bossTutorialUiStyle = {
          fontFamily: 'Mali'
        }

        avoidText.setStyle({
            ...bossTutorialUiStyle,
            color: 'white',
            fontWeight: 700
          })
            .setFontSize('6em')
            .setStroke('#FB511C', 12);


          bulletText.setStyle({
            ...bossTutorialUiStyle,
            color: 'white',
            fontWeight: 700
          })
            .setFontSize('6em')
            .setStroke('#7EAF08', 12);

        }
    });

      setTimeout(()=> {
        // arrow.setVisible(false)
        poison.setVisible(false)
        bullet.setVisible(false)
        poisonBox.setVisible(false)
        bulletBox.setVisible(false)
        avoidText.setVisible(false)
        bulletText.setVisible(false)
      }, 2000)
  }
}

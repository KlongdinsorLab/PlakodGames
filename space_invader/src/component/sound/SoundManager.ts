export default class SoundManager {
    
    private scene: Phaser.Scene
    
    constructor(scene: Phaser.Scene) {
        this.scene = scene
    }
    
    init() {
        const mute = localStorage.getItem("mute") || false;
        if(!mute) return
        this.scene.sound.mute = true
    }
    
    mute() {
        this.scene.sound.mute = true
    }
    
    unmute() {
        this.scene.sound.mute = false
    }
    
    play(sound: Phaser.Sound.BaseSound, overlap = false) {
        if(!sound?.isPlaying || overlap) sound?.play()
    }
    
    stop(sound: Phaser.Sound.BaseSound) {
        sound?.stop()
    }
    
    pause(sound: Phaser.Sound.BaseSound) {
        sound?.pause()
    }
    
    createSoundToggle(x: number, y: number): void {
        const text = this.scene.add.text(x, y, `Sound: ${this.scene?.sound.mute ? 'Off':'On'}`)
        text.setInteractive();
        text.on("pointerup", () => {
            this.scene.sound.mute = !this.scene.sound.mute;
            localStorage.setItem("mute", !this.scene.sound.mute ? 'true': '')
            text.setText(`Sound: ${this.scene?.sound.mute ? 'On':'Off'}`);
        });
        
    }
}
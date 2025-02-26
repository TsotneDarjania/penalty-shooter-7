export class AudioManager {
    private static instance: AudioManager;
    private readonly music: HTMLAudioElement | null = null;
    private readonly isMuted: boolean;

    protected constructor() {
        this.music = new Audio("/music/fruit-background.mp3");
        this.music.loop = true;
        this.music.volume = 1;

        this.isMuted = false;
    }

    public static createInstance(): AudioManager {
        if (!this.instance) {
            this.instance = new AudioManager();
        }
        return this.instance;
    }

    playMusic(): void {
        if (this.music && !this.isMuted) {
            this.music.play();
        }
    }

    stopMusic(): void {
        if (this.music) {
            this.music.pause();
        }
    }

    public get isPlaying(): boolean {
        return this.music ? !this.music.paused : false;
    }
}

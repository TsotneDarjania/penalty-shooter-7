export class AudioManager {
    private static instance: AudioManager;
    private readonly music: HTMLAudioElement;
    private isMuted: boolean = true;
    private startedAudio: boolean = false;

    protected constructor() {
        this.music = new Audio("/music/fruit-background.mp3");
        this.music.loop = true;
        this.music.volume = 0;
    }

    public static createInstance(): AudioManager {
        if (!this.instance) {
            this.instance = new AudioManager();
        }
        return this.instance;
    }

    playMusic(volume: number = 1): void {
        if(!this.startedAudio){
            this.startedAudio = true;
            this.music.play();
        }
        if (this.isMuted) {
            this.isMuted = false;
            this.music.volume = volume;
        }
    }

    stopMusic(): void {
        if (!this.isMuted) {
            this.isMuted = true;
            this.music.volume = 0;
        }
    }

    public get isPlaying(): boolean {
        return !(this.music.volume === 0);
    }
}

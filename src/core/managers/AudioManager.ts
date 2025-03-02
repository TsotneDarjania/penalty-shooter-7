import { Howl } from "howler";

export class AudioManager {
    private static instance: AudioManager;
    private audioMap: Map<string, Howl> = new Map();
    private backgroundMusic?: Howl;
    private isMuted: boolean = true;
    private startedAudio: boolean = false;

    private constructor(audioList: Record<string, string>) {
        this.initializeAudio(audioList);
    }

    private initializeAudio(audioList: Record<string, string>): void {
        for (const key in audioList) {
            if (audioList.hasOwnProperty(key)) {
                const sound = new Howl({ src: [audioList[key]], loop: key === "theme" || key === "drySpin" });
                this.audioMap.set(key, sound); // Store by name

                if (key === "theme") {
                    this.backgroundMusic = sound;
                }
            }
        }
        console.log(audioList);
    }

    public static createInstance(audioList: Record<string, string>): AudioManager {
        if (!this.instance) {
            this.instance = new AudioManager(audioList);
        }
        return this.instance;
    }

    public playSound(name: string): void {
        const sound = this.audioMap.get(name);
        if (sound && !this.isMuted) {
            sound.play();
        }
    }

    public stopSound(name: string): void {
        const sound = this.audioMap.get(name);
        if (sound) {
            sound.stop();
        }
    }

    public toggleMute(): void {
        this.isMuted = !this.isMuted;
        this.audioMap.forEach(sound => sound.mute(this.isMuted));
    }

    // რეგისტრირებული საუნდები არ ირთვება როცა toggle ხდება ხმების
    // მაგალითად რილი სპინ პროცესშია და sound on, მხოლოდ theme ირთვება
    public playBackgroundMusic(): void {
        if(!this.startedAudio){
            this.startedAudio = true;
            this.isMuted = false;
            this.backgroundMusic!.play();
        }

        if (this.isMuted) {
            this.isMuted = false;
            this.backgroundMusic?.volume(1);
        }
    }

    public stopBackgroundMusic(): void {
        if (!this.isMuted) {
            this.isMuted = true;
            this.backgroundMusic!.volume(0);
        }
    }

    public get isBackgroundPlaying(): boolean {
        return (this.backgroundMusic?.volume() === 1 && this.startedAudio);
    }
}

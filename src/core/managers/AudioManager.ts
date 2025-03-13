import { Howl } from "howler";

export class AudioManager {
  theme!: Howl;
  ballShoot!: Howl;
  saveCenter!: Howl;
  saveleft!: Howl;
  saveRight!: Howl;
  goalRight!: Howl;
  goalLeft!: Howl;
  goalCenter!: Howl;

  constructor() {
    this.init();
  }

  init() {
    this.theme = new Howl({
      src: GameAssets.music.theme,
      autoplay: false,
      volume: 0,
      loop: true,
    });

    this.theme.play();

    this.ballShoot = new Howl({
      src: GameAssets.music.ballShoot,
      autoplay: false,
      volume: 0,
    });

    this.saveCenter = new Howl({
      src: GameAssets.music.saveCenter,
      autoplay: false,
      volume: 0,
    });

    this.saveleft = new Howl({
      src: GameAssets.music.saveLeft,
      autoplay: false,
      volume: 0,
    });

    this.saveRight = new Howl({
      src: GameAssets.music.saveRight,
      autoplay: false,
      volume: 0,
    });

    this.goalRight = new Howl({
      src: GameAssets.music.goalRight,
      autoplay: false,
      volume: 0,
    });
    this.goalLeft = new Howl({
      src: GameAssets.music.goalLeft,
      autoplay: false,
      volume: 0,
    });
    this.goalCenter = new Howl({
      src: GameAssets.music.goalCenter,
      autoplay: false,
      volume: 0,
    });
  }

  muteAllSound() {
    this.theme.volume(0);
    this.ballShoot.volume(0);
    this.saveCenter.volume(0);
    this.saveleft.volume(0);
    this.saveRight.volume(0);
    this.goalCenter.volume(0);
    this.goalLeft.volume(0);
    this.goalRight.volume(0);
  }

  unMuteAllSound() {
    this.theme.volume(1);
    this.ballShoot.volume(1);
    this.saveCenter.volume(1);
    this.saveleft.volume(1);
    this.saveRight.volume(1);
    this.goalCenter.volume(1);
    this.goalLeft.volume(1);
    this.goalRight.volume(1);
  }
}

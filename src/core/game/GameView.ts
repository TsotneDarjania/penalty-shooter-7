import { Application, Assets, ContainerChild, Sprite, Texture } from "pixi.js";
import { initDevtools } from "@pixi/devtools";
import { GameLoader } from "./loader";
import { gameAssets } from "../config/loadData.ts";
import { Board } from "./board/index.ts";

export class GameView extends Application {
  private gameLoader!: GameLoader;
  private board!: Board;

  readonly width!: number;
  readonly height!: number;

  constructor(public gameElement: HTMLElement) {
    super();

    this.width = this.gameElement.offsetWidth;
    this.height = this.gameElement.offsetHeight;

    this.createGameLoader();
  }

  private createGameLoader() {
    this.gameLoader = new GameLoader(this);
  }

  public showLoadingScreen() {
    this.gameLoader.init();
  }

  public hideLoadingScreen() {
    this.gameLoader.background.destroy();
    this.gameLoader.loadingBar.destroy();
    this.gameLoader.onAimLogo.destroy();
  }

  public add(obj: ContainerChild) {
    this.stage.addChild(obj);
  }

  public remove(obj: ContainerChild) {
    obj.destroy();
  }

  public showGame() {
    // this.addBackground();
    this.addBoard();
  }

  public startSpin() {
    this.board.startSpin();
  }

  public stopSpin(skip = false) {
    this.board.stopSpin(
      skip,
      [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ],
      {
        lines: [[0, 0, 0]],
      }
    );
  }

  private addBoard() {
    this.board = new Board(this.width / 2, this.height / 2, 350, 350, {
      reelsCount: 3,
      symbolsPerReel: 3,
      spinDelayBetweenReels: 100,
      symbolKeys: [GameAssets.animations.symbols.vine.json],
      initCombination: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ],
      config: {
        symbolTextureOriginalWidth: 530,
        symbolTextureOriginalHeight: 964,
      },
      padding: 0,
      spinDuration: 0.11,
      spinStyle: "classic",
    });

    this.add(this.board);
  }

  private async addBackground() {
    const texture = await Assets.load({
      src: "../assets/videos/background.webm",
      data: {
        resourceOptions: {
          preload: true,
          autoPlay: true,
          loop: true,
          autoLoad: true,
        },
      },
      loadParser: "loadVideo",
    });

    // Access the underlying video element

    const videoSprite = new Sprite(texture);
    // texture.source.options.loop = true;
    // texture.source.options.antialias = true;
    // texture.source.options.preload = true;
    // console.log(texture.source);

    // const videoElement = texture.baseTexture.resource.source;
    // videoElement.loop = true;
    //
    // Set the sprite as a background by scaling it to the stage size
    videoSprite.width = this.width;
    videoSprite.height = this.height;

    // Add the video sprite to the stage
    this.add(videoSprite);

    // const video = document.createElement("video");
    // video.style.position = "absolute";
    // video.style.top = "0";
    // video.src = "../assets/videos/background.webm";
    // video.autoplay = true;
    // video.style.zIndex = "0";
    // video.loop = true;
    // video.muted = true; // Required for autoplay in some browsers
    // video.style.width = "100%"; // Adjust size as needed

    // document.getElementById("game-container")!.appendChild(video);
    // const background = new CustomSprite(
    //   GameAssets.images.background,
    //   this.width / 2,
    //   this.height / 2
    // );
    // // background.scale = 0.35;
    // this.add(background);
    // Animation Test
    // const animation = Spine.from({
    //   skeleton: GameAssets.animations.symbols.vine.json,
    //   atlas: GameAssets.animations.symbols.vine.skeleton,
    // });
    // animation.x = this.width / 2;
    // animation.y = this.height / 2;
    // animation.state.setAnimation(0, "Win", true);
    // this.add(animation);
  }

  public async startLoadingAssets() {
    await this.gameLoader.loadGameAssets(gameAssets);
  }

  public async setup(devTools: boolean) {
    //Load Assets  LoadingScreen
    await Assets.load({
      alias: "onAimLogo",
      src: "../assets/images/onaim-logo.png",
      data: {
        scaleMode: "linear",
        autoGenerateMipMaps: true,
      },
    });

    await this.init({
      background: "#ffffff",
      backgroundAlpha: 0,
      resizeTo: this.gameElement,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });

    devTools && (await initDevtools(this));
    this.gameElement!.appendChild(this.canvas);
  }
}

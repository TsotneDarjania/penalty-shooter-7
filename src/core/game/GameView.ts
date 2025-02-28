import {
  Application as PixiApplication,
  Assets,
  ContainerChild,
  Sprite,
  Texture,
} from "pixi.js";
import { initDevtools } from "@pixi/devtools";
import { GameLoader } from "./loader";
import { gameAssets } from "../config/loadData.ts";
import { Board } from "./board/index.ts";
import { boardDataConfig } from "./config/boardConfig.ts";

export class GameView extends PixiApplication {
  private gameLoader!: GameLoader;
  board!: Board;
  private background!: Sprite;

  width!: number;
  height!: number;

  globalScale: number = 1;

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
    this.addBackground();
    this.addBoard();
  }

  private destroyGame() {
    this.board.destroy();
    this.background.destroy();
  }

  public startSpin() {
    this.board.startSpin();
  }

  public stopSpin(
    skip = false,
    combination: number[][] = [],
    lines: number[][]
  ): void {
    this.board.stopSpin(skip, combination, { lines: lines });
  }

  private addBoard() {
    this.board = new Board(
      this.getScaledX(0.5),
      this.getScaledY(0.39),
      780,
      775,
      boardDataConfig
    );

    this.board.zIndex = 1;
    this.board.scale = this.setScale(1);
    this.add(this.board);
  }

  setScale(scale: number) {
    return this.background !== undefined
      ? this.background.scale.x * scale
      : scale;
  }

  getScaledX(x: number) {
    return x * this.globalScale * this.width;
  }

  getScaledY(y: number) {
    return y * this.globalScale * this.height;
  }

  private addBackground() {
    this.background = new Sprite(Texture.from(GameAssets.video.background));
    this.background.anchor = 0.5;
    this.background.x = this.width / 2;
    this.background.y = this.height / 2;

    // this.background.scale = this.width / this.background.getSize().width + 0.01;
    this.background.width = this.width;
    this.background.height = this.height;
    this.add(this.background);
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
      background: "rgba(255,255,255,0)",
      resizeTo: this.gameElement,
      antialias: true,
      resolution: window.devicePixelRatio || 2,
      autoDensity: true,
    });

    devTools && (await initDevtools(this));
    this.gameElement!.appendChild(this.canvas);

    window.addEventListener("resize", () => {
      this.width = this.gameElement.offsetWidth;
      this.height = this.gameElement.offsetHeight;

      this.destroyGame();
      this.showGame();
    });
  }
}

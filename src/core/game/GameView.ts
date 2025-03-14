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

import { FootballDoor } from "./footballDoor/index.ts";
import { Ball } from "./ball/index.ts";
import { Character } from "./character/index.ts";
import { ScoreIndicators } from "./scoreIndicators/index.ts";
import { GameInitData } from "../../api/endpoints/initialDataEndpoint.ts";
import { DoorTargetPoints } from "./doorTargetPoints/index.ts";

import { setBallTrail } from "../config/runtimeHelper.ts";
import { BallTrail } from "./ballTrail/index.ts";

export class GameView extends PixiApplication {
  gameLoader!: GameLoader;
  background!: Sprite;
  footballDoor!: FootballDoor;
  ball!: Ball;
  character!: Character;
  scoreIndicators!: ScoreIndicators;
  doorTargets!: DoorTargetPoints;

  width!: number;
  height!: number;

  globalScale: number = 1;

  constructor(public gameElement: HTMLElement) {
    super();

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
    this.addFootballDoor();
    this.addBall();
    this.addCharacter();
    this.addDoorTargets();
    this.addBallTrail();
  }

  addBallTrail() {
    const ballTrail = new BallTrail(this);
    setBallTrail(ballTrail);
  }

  addDoorTargets() {
    this.doorTargets = new DoorTargetPoints(this.footballDoor, this);
    this.doorTargets.aniamteToHideTargets();
  }

  addScoreIndicators(initialData: GameInitData) {
    this.scoreIndicators = new ScoreIndicators(this, initialData);
  }

  addCharacter() {
    this.character = new Character(
      this,
      this.getScaledX(0.5),
      this.getScaledY(0.54)
    );
  }

  addBall() {
    this.ball = new Ball(
      this.getScaledX(0.5),
      this.getScaledY(0.88),
      this.setScale(3.5),
      this
    );
    this.ball.zIndex = 1000;
    this.add(this.ball);
  }

  addFootballDoor() {
    this.footballDoor = new FootballDoor();
    this.footballDoor.scale = this.setScale(1.49);
    this.footballDoor.x = this.getScaledX(0.5);
    this.footballDoor.y = this.getPositionY(0.405);
    this.add(this.footballDoor);
  }

  private destroyGame() {
    this.background.destroy();
    this.character.destroy();
    this.footballDoor.destroy();
    this.ball.destroy();
  }

  public startSpin() {
    // this.board.startSpin();
  }

  getPositionX(x: number) {
    return this.background.x + x * this.background.width;
  }

  getPositionY(y: number) {
    return this.background.y + y * this.background.height;
  }

  public stopSpin() {}

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
    this.background = new Sprite(Texture.from(GameAssets.images.background));
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

    this.width = this.gameElement.clientWidth;
    this.height = window.innerHeight;

    await this.init({
      width: this.width,
      height: window.innerHeight,
      background: "rgba(255,255,255,0)",
      antialias: true,
      autoDensity: true,
      preference: "webgpu",
      resolution: window.devicePixelRatio || 1,
    });

    devTools && (await initDevtools(this));
    this.gameElement!.appendChild(this.canvas);

    window.addEventListener("resize", () => {
      this.width = this.gameElement.clientWidth;
      this.height = this.gameElement.clientHeight;
      this.destroyGame();
      this.showGame();
    });
  }
}

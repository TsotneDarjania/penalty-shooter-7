import { BaseGameManager } from "./BaseGameManager.ts";
import { Api } from "../../api/api.ts"; // API PACKAGE
import {
  betType,
  GameInitData,
  InitialDataEndpoint,
} from "../../api/endpoints/initialDataEndpoint.ts"; // API PACKAGE
import { GameView } from "../game/GameView.ts";
import { HtmlUI } from "../../ui/html/index.ts"; // UI PACKAGE
import {
  PlayerBalance,
  PlayerBalanceEndpoint,
} from "../../api/endpoints/playerBalanceEndpoint.ts";
import { AudioManager } from "./AudioManager.ts";
import { ISlotGameManagerInstance } from "./interfaces/index.ts";
import { BetDataEndpoint } from "../../api/endpoints/placeBetEndpoint.ts";
import { pointsType } from "../game/doorTargetPoints/index.ts";
import {
  createKey,
  findClosestPoint,
  getRandomIntInRange,
} from "../game/helper/index.ts";
import { UIEvents } from "../../ui/html/enums/index.ts";
import { PenaltyKickEndpoint } from "../../api/endpoints/penaltyKickEndpoint.ts";
import { Point, Sprite, Texture } from "pixi.js";
import { GameEventEnums } from "../game/enums/gameEvenetEnums.ts";
import gsap from "gsap";

type SelectedPointType = [
  string,
  {
    x: number;
    y: number;
    targetImage?: Sprite;
    failGoalKeeperJumpData: {
      direction: "center" | "left" | "right";
      height: 0 | 1 | 2;
    };
    succesGoalKeeperJumpData: {
      direction: "center" | "left" | "right";
      height: 0 | 1 | 2;
    };
    ball: {
      isSave: {
        fallingDawnPath: string;
      };
      isNotSave: {
        fallingDawnPath: string;
      };
      fallingDawnPathData: {
        offsetX: number;
        offsetY: number;
      };
    };
  }
];

export class PenaltyGameManager extends BaseGameManager {
  private static instance: PenaltyGameManager;
  private ui!: HtmlUI;

  private gameStatus: "prepare" | "playing" = "prepare";

  isShootCommand = false;

  isWin = true;

  userSelectedPoints!: [number, number];

  playerScore = 0;

  kickRemaining!: number;

  isPlayAgain = false;

  userHasNotEnoughBalance = false;

  goalKeeperJumpData!: {
    direction: "center" | "left" | "right";
    height: 0 | 1 | 2;
  };

  playerBalance!: PlayerBalance;

  private constructor() {
    super();
  }

  startPlay(): void {}

  handleResult(result: any): void {}

  public static async createInstance(
    options: ISlotGameManagerInstance
  ): Promise<PenaltyGameManager> {
    if (!this.instance) {
      this.instance = new PenaltyGameManager();
      await this.instance.init(options.gameContainer, options.uiContainer);
    }
    return this.instance;
  }

  private async init(
    GameContainer: HTMLElement,
    UIContainer: HTMLElement
  ): Promise<void> {
    await this.createGame(GameContainer);
    await this.gameView.setup(true);
    this.gameView.showLoadingScreen();
    this.ui = HtmlUI.getInstance();
    this.ui.initialize(UIContainer, this.gameView);

    this.playerBalance = await this.getPlayerBalance();
    this.playerBalance.balance.amount = 10;
    this.setBalance(this.playerBalance.balance);
    // Wait for assets to load (Game assets)
    await this.gameView.startLoadingAssets();
    this.audioManager = AudioManager.createInstance(GameAssets.music);
    this.initialData = await this.getInitialData();

    if (this.initialData.gameConfigInfo === undefined) {
      this.ui.showNotification("Server Error", "something went wrong");
      return;
    }

    if (this.initialData.hasActiveGame) {
      this.playerScore = this.initialData.activeGameInfo!.goalsScored;
      setTimeout(() => {
        this.gameStatus = "playing";
      }, 50);

      // this.ui.showResumeButton();
      this.ui.userCanBet = false;
      document.getElementById("bet-section")!.style.opacity = "0.5";
      this.selectedBetOption = this.initialData.gameConfigInfo.betPrices.find(
        (bet) => bet.betPriceId === this.initialData.activeGameInfo!.betPriceId
      )!;

      document.getElementById("prize-bar")!.style.display = "block";
      document.getElementById("prize_bar_text")!.innerHTML = `Prize : ${
        this.initialData.activeGameInfo!.prizeValue
      }  ${this.initialData.activeGameInfo!.coin}`;
    } else {
      this.ui.showGameBlockShadow();
      document.getElementById("welcome_popup")!.style.display = "block";
      document.getElementById(
        "welcome_popup_text"
      )!.innerHTML = `Play penalty shoot-out against the goalkeeper, score ${
        Math.floor(this.initialData.gameConfigInfo.kicksCount / 2) + 1
      } out of ${
        this.initialData.gameConfigInfo.kicksCount
      } penalties and win amazing prizes!`;

      this.selectedBetOption = this.initialData!.gameConfigInfo.betPrices[0];
    }
    this.gameView.showGame();

    this.ui.elements.placeBetButton!.style.width = `${this.gameView.setScale(
      120
    )}px`;
    this.ui.elements.placeBetButton!.style.height = `${this.gameView.setScale(
      120
    )}px`;
    this.ui.elements.placeBetButton!.style.left = `${this.gameView.getPositionX(
      0.394
    )}px`;
    this.ui.elements.placeBetButton!.style.bottom = `${this.gameView.getPositionY(
      0.061
    )}px`;
    if (this.initialData.hasActiveGame === false) {
      this.ui.elements.placeBetButton!.style.display = "flex";
    }

    this.gameView.addScoreIndicators(this.initialData);
    // DRAW UI
    this.ui.showUI();
    this.ui.setBalance(this.balance.amount);
    this.ui.setBetOptions(this.initialData.gameConfigInfo.betPrices);

    this.gameView.hideLoadingScreen();
    this.addEventListeners();
  }

  addEventListeners() {
    window.addEventListener("pointerdown", () => {
      this.ui.hideGameBlockShadow();
      document.getElementById("welcome_popup")!.style.display = "none";
      document.getElementById("last_popup")!.style.display = "none";
    });

    // User Clicked play Button
    this.ui.elements.placeBetButton!.addEventListener("pointerdown", () => {
      if (
        this.playerBalance.balance.amount < this.selectedBetOption.betAmount
      ) {
        this.userHasNotEnoughBalance = true;
      }

      if (this.userHasNotEnoughBalance) return;

      if (this.isPlayAgain) {
        document.getElementById("last_popup")!.style.display = "none";
        this.ui.hideGameBlockShadow();
        document.getElementById("bet-section")!.style.opacity = "0.5";
        this.ui.elements.placeBetButton!.style.display = "none";
        this.placaBet();
        this.ui.userCanBet = false;
        this.playerScore = 0;
        this.gameView.scoreIndicators.reset();
        setTimeout(() => {
          this.gameStatus = "playing";
        }, 200);
      } else {
        this.ui.hideGameBlockShadow();
        this.placaBet();
        this.ui.userCanBet = false;
        document.getElementById("bet-section")!.style.opacity = "0.5";
        this.ui.elements.placeBetButton!.style.display = "none";
        document.getElementById("welcome_popup")!.style.display = "none";

        setTimeout(() => {
          this.gameStatus = "playing";
        }, 200);
      }
    });

    // player Clicked ball
    // const ballEventTarget = document.createElement("div");
    // ballEventTarget.style.width = `${this.gameView.getScaledX(0.25)}px`;
    // ballEventTarget.style.height = `${this.gameView.getScaledX(0.25)}px`;
    // // ballEventTarget.style.backgroundColor = "blue";
    // ballEventTarget.style.borderRadius = "50%";
    // ballEventTarget.style.position = "absolute";
    // ballEventTarget.style.top = `${this.gameView.getScaledY(0.88)}px`;
    // ballEventTarget.style.left = "50%";
    // ballEventTarget.style.transform = "translate(-50%, -50%)"; // Centering
    // document.getElementById("game-ui")!.appendChild(ballEventTarget);

    // Player Change Bet
    this.ui.eventEmitter.on(
      UIEvents.SEND_BET_OPTION,
      (selectedBetOption: betType) => {
        this.selectedBetOption = selectedBetOption;
      }
    );

    document
      .getElementById("game_events_window")!
      .addEventListener("pointerup", (event) => {
        if (this.gameStatus === "playing") {
          this.playerWantShoot(event);
        }
      });

    document
      .getElementById("game-panel-bck")!
      .addEventListener("pointerup", (event) => {
        if (this.gameStatus === "playing") {
          this.playerWantShoot(event);
        }
      });

    document
      .getElementById("game-panel-container-masked-bck")!
      .addEventListener("pointerup", (event) => {
        if (this.gameStatus === "playing") {
          this.playerWantShoot(event);
        }
      });

    this.gameView.ball.eventEmitter.on(
      GameEventEnums.ballTouchGoalKeeperOrGrid,
      () => {
        this.isWin &&
          this.gameView.footballDoor!.playGridAnimation(
            this.userSelectedPoints
          );

        const circle = new Sprite(
          this.isWin
            ? Texture.from(GameAssets.images.winCircle)
            : Texture.from(GameAssets.images.loseCircle)
        );
        this.gameView.add(circle);

        const points = this.gameView.ball!.toGlobal(
          new Point(
            this.gameView.ball!.ballGraphic.container.x,
            this.gameView.ball!.ballGraphic.container.y
          )
        );

        circle.anchor = 0.5;
        circle.x = points.x;
        circle.y = points.y;
        circle.scale.x = 0;
        circle.scale.y = 0;

        this.showCircleAnimation(circle);
      }
    );

    this.gameView.ball!.eventEmitter.on(
      GameEventEnums.isTimeToJumpGoalKeeper,
      () => {
        this.gameView.character.jump(
          this.goalKeeperJumpData.direction,
          this.goalKeeperJumpData.height
        );
      }
    );

    this.gameView.ball!.eventEmitter.on(
      GameEventEnums.finishFallingOfBall,
      () => {
        this.isWin
          ? this.gameView.scoreIndicators.addCorrectScore()
          : this.gameView.scoreIndicators.addWrongScore();

        if (this.isWin) {
          this.playerScore++;
        }

        this.gameView.character.reset();
        this.gameView.ball.reset();

        setTimeout(() => {
          this.isShootCommand = false;
        }, 1000);

        const requiredGoalsToWin = Math.floor(
          this.initialData.gameConfigInfo.kicksCount / 2 + 1
        );
        // Check If Win Game
        if (this.playerScore >= requiredGoalsToWin) {
          console.log("You Won!");
          this.gameView.scoreIndicators.reset();
          this.isPlayAgain = true;
          this.gameStatus = "prepare";
          this.ui.showGameBlockShadow();
          document.getElementById("place_bet_button")!.style.display = "flex";
          document.getElementById("prize-bar")!.style.display = "none";

          document.getElementById("last_popup")!.style.display = "block";
          document.getElementById("last_popup_text")!.innerHTML = `You Won!`;
          this.ui.userCanBet = true;
          document.getElementById("bet-section")!.style.opacity = "1";
          // window.location.reload();
        }

        if (this.kickRemaining + this.playerScore < requiredGoalsToWin) {
          console.log("You Lost!");
          this.gameView.scoreIndicators.reset();
          this.isPlayAgain = true;
          this.gameStatus = "prepare";
          this.ui.showGameBlockShadow();
          document.getElementById("place_bet_button")!.style.display = "flex";
          document.getElementById("prize-bar")!.style.display = "none";

          document.getElementById("last_popup")!.style.display = "block";
          document.getElementById("last_popup_text")!.innerHTML =
            "You fell short this time. Give another try!";

          this.ui.userCanBet = true;
          document.getElementById("bet-section")!.style.opacity = "1";
          // window.location.reload();
        }
      }
    );

    document
      .getElementById("play_again_button")!
      .addEventListener("pointerdown", () => {
        document.getElementById("play_again_button")!.style.display = "none";
        this.ui.userCanBet = true;
        document.getElementById("bet-section")!.style.opacity = "1";
        this.playerScore = 0;
        this.ui.hideGameBlockShadow();
        this.gameView.scoreIndicators.reset();
        this.ui.elements.placeBetButton!.style.display = "flex";
      });
  }

  showCircleAnimation(sprite: Sprite) {
    gsap.to(sprite.scale, {
      duration: 0.4,
      x: this.gameView.ball!.ballGraphic.staticSprite.scale.x + 0.16,
      y: this.gameView.ball!.ballGraphic.staticSprite.scale.y + 0.16,
      onComplete: () => {
        gsap.to(sprite, {
          duration: 0.7,
          alpha: 0,
        });
        gsap.to(sprite.scale, {
          duration: 0.4,
          x: this.gameView.ball!.ballGraphic.staticSprite.scale.x + 0.23,
          y: this.gameView.ball!.ballGraphic.staticSprite.scale.y + 0.23,

          onComplete: () => {
            sprite.destroy();
          },
        });
      },
    });
  }

  playerWantShoot(event: PointerEvent) {
    const mousePosition = event;

    const targetPoint = {
      x: mousePosition.x - (window.innerWidth - this.gameView.width) / 2, //do not touch it!,
      y: mousePosition.y,
    };

    const points = Array.from(this.gameView.doorTargets.points.values()).map(
      (point) => {
        return { x: point.x, y: point.y };
      }
    );

    const closestPoint = findClosestPoint(points, targetPoint);

    const selectedPoint = Array.from(
      this.gameView.doorTargets.points.entries()
    ).find((point) => {
      return point[1].x === closestPoint.x && point[1].y === closestPoint.y;
    });

    this.shoot(selectedPoint!);
  }

  async shoot(selectedPoint: SelectedPointType) {
    if (this.isShootCommand) return;
    this.isShootCommand = true;
    this.gameView.ball.spinManager.startSpin();

    const penaltyKickResponse = await Api.call(PenaltyKickEndpoint);
    this.isWin = penaltyKickResponse.isGoal;
    this.kickRemaining = penaltyKickResponse.kicksRemaining;

    const userSelectedPoint = selectedPoint[0]!.split(",").map(Number) as [
      number,
      number
    ];

    this.userSelectedPoints = userSelectedPoint;

    const x = selectedPoint[1].x;
    const y = selectedPoint[1].y;
    this.gameView.ball!.shoot({
      x,
      y,
    });

    this.determineBallDownPath(this.isWin, selectedPoint);

    this.goalKeeperJumpData = this.isWin
      ? this.gameView.doorTargets.points.get(selectedPoint[0])!
          .failGoalKeeperJumpData
      : this.gameView.doorTargets.points.get(selectedPoint[0])!
          .succesGoalKeeperJumpData;
  }
  determineBallDownPath(isWin: boolean, selectedPoint: SelectedPointType) {
    this.gameView.ball!.ballFallinDownRawPathData = {
      path: !isWin
        ? this.gameView.doorTargets.points.get(selectedPoint[0])!.ball.isSave
            .fallingDawnPath
        : this.gameView.doorTargets.points.get(selectedPoint[0])!.ball.isNotSave
            .fallingDawnPath,
      offsetX: !isWin
        ? this.gameView.doorTargets.points.get(selectedPoint[0])!.ball
            .fallingDawnPathData.offsetX
        : this.gameView.doorTargets.points.get(selectedPoint[0])!.ball
            .fallingDawnPathData.offsetX,
      offsetY: !isWin
        ? this.gameView.doorTargets.points.get(selectedPoint[0])!.ball
            .fallingDawnPathData.offsetY
        : this.gameView.doorTargets.points.get(selectedPoint[0])!.ball
            .fallingDawnPathData.offsetY,
    };
  }

  async placaBet() {
    const res = await Api.call(
      BetDataEndpoint,
      this.selectedBetOption.betPriceId
    );

    document.getElementById("prize-bar")!.style.display = "block";
    document.getElementById("prize_bar_text")!.innerHTML = `Prize : ${
      res.prizeValue
    }  ${res!.coin}`;

    if (res.prizeId === undefined || null) {
      this.ui.showGameBlockShadow();
      this.ui.showNotification("Server Error", "prize value is undefined");
    }

    // console.log(this.selectedBetOption);
    // console.log(res);
  }

  private async createGame(GameContainer: HTMLElement): Promise<void> {
    this.gameView = new GameView(GameContainer);
  }

  public async getPlayerBalance(): Promise<PlayerBalance> {
    return await Api.call(PlayerBalanceEndpoint);
  }

  async getInitialData(): Promise<GameInitData> {
    return await Api.call(InitialDataEndpoint);
  }

  private handleSoundButton(): void {
    if (this.audioManager.isBackgroundPlaying) {
      this.audioManager.stopBackgroundMusic();
      this.ui.updateSoundButtonImage(false); // Update UI
    } else {
      this.audioManager.playBackgroundMusic();
      this.ui.updateSoundButtonImage(true); // Update UI
    }
  }
}

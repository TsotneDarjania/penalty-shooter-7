import { Container, EventEmitter, Graphics } from "pixi.js";
import { Reel } from "./reel";
import { ReelStatusEvents, SymbolStatusEvents } from "./enums";
import { SlotSymbol } from "./reel/slotSymbol";
import { Spine } from "@esotericsoftware/spine-pixi-v8";

export type boardDataType = {
  reelsCount: number;
  symbolsPerReel: number;
  spinDelayBetweenReels: number;
  symbolKeys: Array<string>;
  initCombination: Array<number>[];
  config: {
    symbolTextureOriginalWidth: number;
    symbolTextureOriginalHeight: number;
  };
  padding: number;
  spinDuration: number;
  spinStyle: "classic" | "fast";
};

export type boardWinningType = {
  lines: number[][];
};

export class Board extends Container {
  eventEmitter!: EventEmitter;

  state: "readyForSpin" | "startSpin" | "spinning" | "FinishedSpin" =
    "readyForSpin";
  command: "none" | "stop" = "none";
  isStartedStop = false;

  reels: Reel[] = [];

  slotSymbolWidth = 0;
  slotSymbolHeight = 0;

  symbolBoxWidth = 0;
  symbolBoxHeight = 0;

  winnings: boardWinningType | undefined;

  resultCombination!: number[][] | undefined;

  stopWithSkipSpin = false;

  line_0_0_0!: Spine;
  line_1_1_1!: Spine;
  line_2_2_2!: Spine;
  line_0_1_2!: Spine;
  line_2_1_0!: Spine;

  constructor(
    public posX: number,
    public posY: number,
    public displayWidth: number,
    public displayHeight: number,
    public boardData: boardDataType
  ) {
    super({ x: posX, y: posY });

    this.eventEmitter = new EventEmitter();

    if (!this.validate()) return;

    this.symbolBoxWidth = displayWidth / boardData.reelsCount;
    this.symbolBoxHeight = displayHeight / boardData.symbolsPerReel;

    this.slotSymbolWidth = Math.min(this.symbolBoxWidth, this.symbolBoxHeight);
    this.slotSymbolHeight = this.slotSymbolWidth;

    this.init();
  }

  private validate() {
    this.boardData.initCombination.forEach((combination) => {
      combination.forEach((n) => {
        if (n > this.boardData.symbolKeys.length - 1) {
          console.error(
            `InitCombination is not valid because of this index  ---> ${n}`
          );
          return false;
        }
      });
    });

    if (this.boardData.reelsCount > this.boardData.initCombination.length) {
      console.error(
        `InitCombination is not valid because reels number is ---> ${this.boardData.reelsCount}`
      );
      return false;
    }
    return true;
  }

  private init() {
    this.addReels();
    this.addReelEventListeners();
    this.addMask();
    this.adjustReelsYPositions();
    this.createLineAnimation();
  }

  createLineAnimation() {
    const skeletonPath = GameAssets.animations.line.json;
    const atlasPath = skeletonPath.replace(/\.json$/, ".atlas");

    this.line_0_0_0 = Spine.from({
      skeleton: skeletonPath,
      atlas: atlasPath,
    });

    this.line_0_0_0.y += 460;
    this.addChild(this.line_0_0_0);

    this.line_1_1_1 = Spine.from({
      skeleton: skeletonPath,
      atlas: atlasPath,
    });
    this.line_1_1_1.y += 200;
    this.line_1_1_1.x += 0;
    this.addChild(this.line_1_1_1);

    this.line_2_2_2 = Spine.from({
      skeleton: skeletonPath,
      atlas: atlasPath,
    });
    this.line_2_2_2.y -= 57;
    this.addChild(this.line_2_2_2);

    this.line_0_1_2 = Spine.from({
      skeleton: skeletonPath,
      atlas: atlasPath,
    });

    this.line_0_1_2.y += 170;
    this.line_0_1_2.x += 120;
    this.line_0_1_2.rotation = -0.78019;
    this.addChild(this.line_0_1_2);

    this.line_2_1_0 = Spine.from({
      skeleton: skeletonPath,
      atlas: atlasPath,
    });

    this.line_2_1_0.rotation = 0.78019;
    this.line_2_1_0.y += 170;
    this.line_2_1_0.x -= 120;
    this.addChild(this.line_2_1_0);

    this.line_0_0_0.state.setAnimation(0, "Hide", false);
    this.line_1_1_1.state.setAnimation(0, "Hide", false);
    this.line_2_2_2.state.setAnimation(0, "Hide", false);
    this.line_0_1_2.state.setAnimation(0, "Hide", false);
    this.line_2_1_0.state.setAnimation(0, "Hide", false);

    this.line_0_0_0.blendMode = "difference";
    this.line_1_1_1.blendMode = "difference";
    this.line_2_2_2.blendMode = "difference";
    this.line_0_1_2.blendMode = "difference";
    this.line_2_1_0.blendMode = "difference";

    // this.line_0_0_0.alpha = 0.4;
    // this.line_1_1_1.alpha = 0.4;
    // this.line_2_2_2.alpha = 0.4;
    // this.line_0_1_2.alpha = 0.4;
    // this.line_2_1_0.alpha = 0.4;
    // this.line_0_0_0.zIndex = -3;
    // this.line_1_1_1.zIndex = -3;
    // this.line_2_2_2.zIndex = -3;
    // this.line_0_1_2.zIndex = -3;
    // this.line_2_1_0.zIndex = -3;
  }

  private adjustReelsYPositions() {
    const difference = this.displayHeight - this.height;
    this.reels.forEach((reel) => {
      reel.y += difference / 2;
    });
  }

  private addReelEventListeners() {
    this.reels.forEach((reel) => {
      reel.spinManager.eventEmitter.on(ReelStatusEvents.SpinIsStarted, () => {
        if (reel === this.reels[this.reels.length - 1]) {
          this.state = "spinning";
          this.eventEmitter.emit("spinIsStarted");
          if (this.command === "stop") {
            this.stopSpin(this.stopWithSkipSpin);
          }
        }
      });
      reel.spinManager.eventEmitter.on(
        ReelStatusEvents.ReelSpinIsFinished,
        () => {
          this.eventEmitter.emit("reelFinishedSpin");
          if (reel === this.reels[this.reels.length - 1]) {
            this.finishSpin();
          }
        }
      );
      reel.spinManager.eventEmitter.on(
        ReelStatusEvents.ReelStartedStopping,
        () => {
          this.isStartedStop = true;
        }
      );
    });
  }

  private finishSpin() {
    this.eventEmitter.emit("spinIsFinished");
    this.state = "FinishedSpin";
    this.reset();

    if (this.winnings) {
      if (this.winnings.lines.length > 0) {
        this.showWinningAnimations();
      }
    }
  }

  private reset() {
    // this.winnings = undefined;
    this.resultCombination = undefined;
    this.command = "none";
    this.state = "readyForSpin";
    this.isStartedStop = false;
    this.stopWithSkipSpin = false;
    this.eventEmitter.emit("reset");
  }

  private async showWinningAnimations() {
    for (let i = 0; i < this.winnings!.lines.length; i++) {
      await this.animateLine(this.winnings!.lines[i]);
    }

    this.reset();
  }

  private async animateLine(line: number[]) {
    switch (JSON.stringify(line)) {
      case "[2,1,0]":
        this.line_2_1_0.state.setAnimation(0, "Action", true);
        break;
      case "[0,0,0]":
        this.line_0_0_0.state.setAnimation(0, "Action", true);
        break;
      case "[1,1,1]":
        this.line_1_1_1.state.setAnimation(0, "Action", true);
        break;
      case "[2,2,2]":
        this.line_2_2_2.state.setAnimation(0, "Action", true);
        break;
      case "[0,1,2]":
        this.line_0_1_2.state.setAnimation(0, "Action", true);
        break;
    }

    const animationPromises = line.map((symbolIndex, reelIndex) => {
      this.reels.forEach((reel) => {
        reel.children.forEach((symbol) => {
          const slotSymbol = symbol as unknown as SlotSymbol;
          if (slotSymbol.isWinSymbol === false) slotSymbol.deactive();
        });
      });

      return new Promise<void>((resolve) => {
        const slotSymbol = this.reels[reelIndex].children[
          symbolIndex
        ] as unknown as SlotSymbol;
        slotSymbol.playWinAnimation();
        slotSymbol.isWinSymbol = true;
        slotSymbol.eventEmitter.once(
          SymbolStatusEvents.winninAnimationFinished,
          () => {
            resolve();
          }
        );
      });
    });

    await Promise.all(animationPromises);
  }

  private addMask() {
    const mask = new Graphics()
      .rect(
        -this.width / 2,
        -this.height / 2 + 20,
        this.width,
        this.height - 10
      )
      .stroke({ width: 0 })
      .fill();

    this.mask = mask;
    this.addChild(mask);
  }

  private addReels() {
    for (let i = 0; i < this.boardData.reelsCount; i++) {
      const reel = new Reel(
        this,
        this.boardData.initCombination[i],
        -(this.symbolBoxWidth - this.slotSymbolWidth) / 2 -
          this.displayWidth / 2 +
          this.symbolBoxWidth / 2 +
          i *
            (this.displayWidth / this.boardData.reelsCount +
              (this.symbolBoxWidth - this.slotSymbolWidth) /
                (this.boardData.reelsCount - 1))
      );
      this.reels.push(reel);
      this.addChild(reel);
    }
  }

  public startSpin() {
    if (this.state !== "readyForSpin") {
      console.warn("Board is not Ready for spin");
      return;
    }
    this.state = "startSpin";

    this.line_0_0_0.state.setAnimation(0, "Hide", false);
    this.line_1_1_1.state.setAnimation(0, "Hide", false);
    this.line_2_2_2.state.setAnimation(0, "Hide", false);
    this.line_0_1_2.state.setAnimation(0, "Hide", false);
    this.line_2_1_0.state.setAnimation(0, "Hide", false);

    this.reels.forEach((reel) => {
      reel.startSpin();
    });
  }

  public stopSpin(
    isSkipSpin: boolean,
    combination?: Array<Array<number>>,
    winnings: {
      lines: number[][];
    } = {
      lines: [[]],
    }
  ) {
    if (winnings) {
      this.winnings = winnings;
    }

    if (combination) {
      this.resultCombination = combination;
    }

    this.stopWithSkipSpin = isSkipSpin;

    if (this.resultCombination === undefined) {
      console.error("Result Combination Is not Defined");
      return;
    }

    this.reels.forEach((reel, i) => {
      const delay = isSkipSpin ? 0 : 1.3;
      setTimeout(() => {
        reel.stopSpin(this.resultCombination![i], isSkipSpin);
      }, i * (this.boardData.spinDelayBetweenReels * delay));
    });
  }
}

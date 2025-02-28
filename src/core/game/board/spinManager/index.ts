import { Reel } from "../reel";
import { calculatePercentage, getRandomIntInRange } from "../helper/math";
import { SlotSymbol } from "../reel/slotSymbol";
import gsap from "gsap";
import { EventEmitter } from "pixi.js";
import { ReelStatusEvents } from "../enums";

export class SpinManager {
  public eventEmitter!: EventEmitter;
  private isAlreadySentSpinEvenet = false;

  private isSkipSpin = false;

  private isLastSpin = false;
  private resultCombination: number[] = [];

  downMotionDistance = 0;

  gsapAnimation!: GSAPAnimation;
  lastSpinGsapAnimation!: GSAPAnimation;
  goUpGsapAnimation!: GSAPAnimation;

  constructor(public reel: Reel, public symbolKeys: string[]) {
    this.eventEmitter = new EventEmitter();

    this.downMotionDistance =
      reel.paddingBetweenSymbols -
      reel.board.slotSymbolHeight +
      this.reel.board.displayHeight;
  }

  private addNextSymbols() {
    for (let i = 0; i < this.reel.board.boardData.symbolsPerReel; i++) {
      const symbol = new SlotSymbol(
        this.isLastSpin
          ? this.symbolKeys[this.resultCombination[i]]
          : this.symbolKeys[getRandomIntInRange(0, this.symbolKeys.length - 1)],
        this.reel.topSymbolPositionY -
          this.reel.paddingBetweenSymbols -
          i * this.reel.paddingBetweenSymbols -
          this.reel.y,
        this.reel.board.slotSymbolWidth,
        this.reel.board.slotSymbolHeight,
        this.reel.board.boardData.padding
      );
      this.reel.addChild(symbol);
    }
  }

  public startSpin() {
    this.addNextSymbols();
    this.goUp();
  }

  private goUp() {
    this.goUpGsapAnimation = gsap.to(this.reel, {
      duration:
        this.reel.board.boardData.spinDuration +
        this.reel.board.boardData.spinDuration * 0.5,
      y: this.reel.y - calculatePercentage(25, this.reel.board.displayHeight),
      // ease: "back"
      ease: "back.in",
      onUpdate: () => {
        this.isLastSpin && this.goUpGsapAnimation.progress(1);
      },
      onComplete: () => {
        this.goDown(
          this.reel.y +
            calculatePercentage(25, this.reel.board.displayHeight) +
            this.downMotionDistance,
          "sine.in",
          this.reel.board.boardData.spinDuration +
            this.reel.board.boardData.spinDuration * 2
        );
      },
    });
  }

  private goDown(targetY: number, style: string, duration: number) {
    this.gsapAnimation?.kill();
    this.gsapAnimation = gsap.to(this.reel, {
      duration: duration,
      y: targetY,
      ease: style,
      onUpdate: () => {
        this.isLastSpin && this.gsapAnimation.progress(1);
      },
      onComplete: () => {
        this.reel.children
          .slice(0, this.reel.board.boardData.symbolsPerReel)
          .forEach((symbol) => {
            this.reel.removeChild(symbol);

            (symbol as SlotSymbol).destroy();
            (symbol as SlotSymbol).spine.destroy();
          });

        if (!this.isAlreadySentSpinEvenet) {
          this.eventEmitter.emit(ReelStatusEvents.SpinIsStarted);
          this.isAlreadySentSpinEvenet = true;
        }

        if (this.isLastSpin) {
          this.lastGoDown();
          return;
        }

        this.addNextSymbols();
        this.goDown(
          this.reel.y + this.downMotionDistance,
          "none",
          this.reel.board.boardData.spinDuration * 1.2
        );
      },
    });
  }

  private lastGoDown() {
    this.eventEmitter.emit(ReelStatusEvents.ReelStartedStopping);
    this.addNextSymbols();
    this.lastSpin(
      this.reel.y + this.downMotionDistance,
      this.reel.board.boardData.spinStyle ? "back.out" : "back.out",
      this.isSkipSpin
        ? this.reel.board.boardData.spinDuration * 3
        : this.reel.board.boardData.spinDuration * 5
    );
  }

  private lastSpin(targetY: number, style: string, duration: number) {
    this.lastSpinGsapAnimation = gsap.to(this.reel, {
      duration: duration,
      y: targetY,
      ease: this.isSkipSpin ? "back.out" : style,
      onComplete: () => {
        this.reel.children
          .slice(0, this.reel.board.boardData.symbolsPerReel)
          .forEach((symbol) => {
            symbol.destroy();
          });
        this.eventEmitter.emit(ReelStatusEvents.ReelSpinIsFinished);
        this.reset();
      },
    });
  }

  public stopSpin(combination: number[], skipSpin: boolean) {
    this.gsapAnimation?.progress(1);
    this.goUpGsapAnimation?.progress(1);
    this.isSkipSpin = skipSpin;
    this.isLastSpin = true;
    this.resultCombination = combination;
    setTimeout(
      () => this.reel.board.eventEmitter.emit("reelFinishedSpin"),
      400
    );
  }

  public reset() {
    this.gsapAnimation.kill();
    this.lastSpinGsapAnimation.kill();
    this.isSkipSpin = false;
    this.isLastSpin = false;
    this.isAlreadySentSpinEvenet = false;
  }
}

// May We Will use Later

// private updateSymbolOpacity() {
//   const topBorder = this.reel.board.y - this.reel.board.displayHeight / 2;
//   const bottomBorder = this.reel.board.y + this.reel.board.displayHeight / 2;

//   this.reel.children.forEach((symbol) => {
//     const symbolY = symbol.toGlobal(this.reel.board).y;

//     // Calculate opacity based on proximity to the borders
//     if (symbolY <= topBorder || symbolY >= bottomBorder) {
//       symbol.alpha = 0; // Fully transparent
//     } else {
//       const distanceToBorder = Math.min(
//         Math.abs(symbolY - topBorder),
//         Math.abs(symbolY - bottomBorder)
//       );
//       const maxDistance = this.reel.board.displayHeight / 4; // Adjust this value as needed
//       symbol.alpha = Math.max(0, Math.min(1, distanceToBorder / maxDistance)); // Normalize to [0, 1]
//     }
//   });
// }

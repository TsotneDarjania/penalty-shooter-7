import { BlurFilter, Container } from "pixi.js";
import { Board } from "..";
import { SlotSymbol } from "./slotSymbol";
import { SpinManager } from "../spinManager";
// import gsap from "gsap";

export class Reel extends Container {
  glowFilter!: BlurFilter;

  spinManager!: SpinManager;
  slotSymbols: SlotSymbol[] = [];

  topSymbolPositionY = 0;

  paddingBetweenSymbols = 0;
  initReelHeight = 0;

  constructor(
    public board: Board,
    public combination: Array<number>,
    public posX: number
  ) {
    super();

    this.x = posX;

    this.init();
  }

  private init() {
    this.calculatePaddingBetweenSymbols();
    this.initSymbols();
    this.createSpinManager();
  }

  calculatePaddingBetweenSymbols() {
    this.paddingBetweenSymbols =
      this.board.displayHeight / this.board.boardData.symbolsPerReel +
      (this.board.symbolBoxHeight - this.board.slotSymbolHeight) /
        (this.board.boardData.symbolsPerReel - 1);
  }

  addGlowEffect() {
    // this.glowFilter = new GlowFilter({
    //   distance: 24,
    //   innerStrength: 1, // Start from 0 for animation
    //   outerStrength: 15, // Start from 0 for animation
    //   color: "#F5BB8A",
    //   alpha: 0, // Start from 0 for animation
    // });
    // // Add the filter to the object
    // this.filters = [this.glowFilter];
    // // Animate the filter properties with GSAP
    // gsap.to(this.glowFilter, {
    //   innerStrength: 3,
    //   outerStrength: 3,
    //   alpha: 0.2,
    //   delay: 0.4,
    //   duration: 1.4, // Animation duration in seconds
    //   ease: "power2.out", // Choose the easing function
    // });
    // this.glowFilter = new BlurFilter({
    //   strength: 0,
    // });
    // this.filters = [this.glowFilter];
    // gsap.to(this.glowFilter, {
    //   strength: 5.5,
    //   delay: 0.2,
    //   duration: 0.5, // Animation duration in seconds
    //   ease: "power2.out", // Choose the easing function
    // });
  }

  removeGlowEffect() {
    // Animate the filter properties with GSAP
    // gsap.to(this.glowFilter, {
    //   innerStrength: 0,
    //   outerStrength: 0,
    //   alpha: 0,
    //   delay: 0.2,
    //   duration: 0.5, // Animation duration in seconds
    //   ease: "power2.out", // Choose the easing function
    //   onComplete: () => {
    //     this.filters = [];
    //   },
    // });
    // this.glowFilter = new GlowFilter({
    //   distance: 24,
    //   innerStrength: 1, // Start from 0 for animation
    //   outerStrength: 15, // Start from 0 for animation
    //   color: "#F5BB8A",
    //   alpha: 0, // Start from 0 for animation
    // });
    // // Add the filter to the object
    // this.filters = [this.glowFilter];
    // // Animate the filter properties with GSAP
    // gsap.to(this.glowFilter, {
    //   innerStrength: 3,
    //   outerStrength: 3,
    //   alpha: 0.2,
    //   delay: 0.4,
    //   duration: 1.4, // Animation duration in seconds
    //   ease: "power2.out", // Choose the easing function
    // });
    // gsap.to(this.glowFilter, {
    //   strength: 0,
    //   duration: 0.5, // Animation duration in seconds
    //   ease: "power2.out", // Choose the easing function
    //   onComplete: () => {
    //     this.filters = [];
    //   },
    // });
  }

  private initSymbols() {
    for (let i = 0; i < this.board.boardData.symbolsPerReel; i++) {
      const symbol = new SlotSymbol(
        this.board.boardData.symbolKeys[this.combination[i]],
        -(this.board.symbolBoxHeight - this.board.slotSymbolHeight) / 2 -
          this.board.displayHeight / 2 +
          this.board.symbolBoxHeight / 2 +
          i * this.paddingBetweenSymbols,
        this.board.slotSymbolWidth,
        this.board.slotSymbolHeight,
        this.board.boardData.padding
      );
      if (i === 0) {
        this.topSymbolPositionY = symbol.y;
      }
      this.slotSymbols.push(symbol);
      this.addChild(symbol);
    }
  }

  private createSpinManager() {
    this.spinManager = new SpinManager(this, this.board.boardData.symbolKeys);
  }

  public startSpin() {
    this.addGlowEffect();
    this.spinManager.startSpin();
  }

  public stopSpin(combination: number[], isSkipSpin: boolean) {
    this.removeGlowEffect();
    this.spinManager.stopSpin(combination, isSkipSpin);
  }
}

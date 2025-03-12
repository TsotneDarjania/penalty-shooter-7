import { BlurFilter } from "pixi.js";
import { Ball } from "..";

export class BlurManager {
  blurFilter!: BlurFilter;
  constructor(public ball: Ball) {
    this.addBlurFilter();
  }

  private addBlurFilter() {
    // this.blurFilter = new BlurFilter({
    //   strength: 0,
    // });
    // this.ball.ballGraphic.container.filters = [this.blurFilter];
  }

  public makeItBlur() {
    // gsap.to(this.blurFilter, {
    //   duration: 0.3,
    //   strength: 2,
    //   ease: "power4.out",
    //   onUpdate: () => {
    //     this.ball.filters = [this.blurFilter];
    //   },
    // });
  }

  public removeBlurEffect() {
    // gsap.to(this.blurFilter, {
    //   duration: 0.3,
    //   strength: 0,
    //   ease: "power4.out",
    //   onUpdate: () => {
    //     this.ball.filters = [this.blurFilter];
    //   },
    // });
  }
}

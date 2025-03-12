import { Ball } from "..";
import gsap from "gsap";

export class ScaleManager {
  constructor(public ball: Ball) {}

  increaseScaleForShoot() {
    // For Selector
    gsap.to(this.ball.ballGraphic.ballSelector.scale, {
      duration: 0.2,
      x: this.ball.ballGraphic.ballSelector.scale.x + 0.26,
      y: this.ball.ballGraphic.ballSelector.scale.y + 0.26,
      ease: "power2",
    });
    gsap.to(this.ball.ballGraphic.ballSelector.greenShadow, {
      duration: 0.2,
      alpha: 0.6,
      ease: "power2",
    });

    // For Ball
    gsap.to(this.ball.ballGraphic.container.scale, {
      duration: 0.2,
      x: this.ball.ballGraphic.container.scale.x + 0.1,
      y: this.ball.ballGraphic.container.scale.y + 0.1,
      ease: "power4.out",
    });

    // For Shadow
    gsap.to(this.ball.ballGraphic.shadow.scale, {
      duration: 0.2,
      x: this.ball.ballGraphic.shadow.scale.x + 0.06,
      y: this.ball.ballGraphic.shadow.scale.y + 0.06,
      ease: "power2",
    });
  }

  startScaleAnimationDuringShoot() {
    // For Ball
    gsap.to(this.ball.ballGraphic.container.scale, {
      duration: 0.1,
      x: 0.7,
      y: 1.2,
      ease: "power2",
      onComplete: () => {
        gsap.to(this.ball.ballGraphic.container.scale, {
          duration: 0.06,
          x: 0.7,
          y: 0.5,
          ease: "power2",
          onComplete: () => {
            gsap.to(this.ball.ballGraphic.container.scale, {
              duration: 0.06,
              x: 0.4,
              y: 0.5,
              ease: "power2",
              onComplete: () => {
                gsap.to(this.ball.ballGraphic.container.scale, {
                  duration: 0.06,
                  x: this.ball.isGoal ? 0.36 : 0.45,
                  y: this.ball.isGoal ? 0.36 : 0.45,
                  ease: "power2",
                });
              },
            });
          },
        });
      },
    });
  }
}

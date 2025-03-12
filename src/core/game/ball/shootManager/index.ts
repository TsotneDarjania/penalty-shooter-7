import { Ball } from "..";
import gsap from "gsap";

import { Container, Point } from "pixi.js";
import { ballTrail } from "../../../config/runtimeHelper";
export class ShootManager {
  parentContainer!: Container;
  shootSound!: Howl;

  constructor(public ball: Ball) {
    this.parentContainer = ball;

    this.shootSound = new Howl({
      src: ["/assets/sounds/shoot.mp3"],
      autoplay: false,
      loop: false,
      volume: 0.8,
    });
  }

  shoot(targetLocation: { x: number; y: number }) {
    this.shootSound.play();

    const localTarget = this.ball.toLocal(
      new Point(targetLocation.x, targetLocation.y)
    );

    gsap.to(this.ball.ballGraphic.container, {
      duration: 0.2,
      x: localTarget.x,
      y: localTarget.y,
      ease: "power2.in",
      onUpdate: () => {
        const localTarget = this.ball.toGlobal(
          new Point(
            this.ball.ballGraphic.container.x,
            this.ball.ballGraphic.container.y
          )
        );

        ballTrail.drawParticles(localTarget.x, localTarget.y);
      },
      onComplete: () => {
        this.ball.eventEmitter.emit("FinishShoot");
      },
    });
  }
}

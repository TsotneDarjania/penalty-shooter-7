import { Sprite } from "pixi.js";
import gsap from "gsap";
import { Ball } from "..";

export class SpinManager {
  isLastRotation = false;
  firstElement!: Sprite;
  lastY!: number;
  startY!: number;

  constructor(public sprites: Sprite[], public ball: Ball) {
    this.firstElement = this.sprites[0];
    this.lastY = this.firstElement.y + this.firstElement.height;
    this.startY = this.firstElement.y - this.firstElement.height;
  }

  public startSpin() {
    this.ball.ballGraphic.staticSprite.alpha = 0;
    for (const sprite of this.sprites) {
      gsap.to(sprite, {
        duration: 0.15,
        y: sprite.y + sprite.height,
        ease: "power3.in",
        onComplete: () => {
          if (sprite.y === this.lastY) {
            sprite.y = this.startY;
          }
          this.moveDown(sprite, this.lastY, this.startY);
        },
      });
    }
  }

  private moveDown(sprite: Sprite, lastY: number, startY: number) {
    gsap.to(sprite, {
      duration: 0.12,
      y: sprite.y + sprite.height,
      ease: "none",
      onComplete: () => {
        if (sprite.y === lastY) {
          sprite.y = startY;
        }

        this.isLastRotation
          ? this.lastMoveDown(sprite, lastY, startY)
          : this.moveDown(sprite, lastY, startY);
      },
    });
  }

  private lastMoveDown(sprite: Sprite, lastY: number, startY: number) {
    gsap.to(sprite, {
      duration: this.isLastRotation ? 0.4 : 0.15,
      y: sprite.y + sprite.height,
      ease: "power4.out",
      onComplete: () => {
        if (sprite.y === lastY) {
          sprite.y = startY;
        }
        this.reset();
      },
    });
  }

  stopRotation() {
    this.isLastRotation = true;
  }

  reset() {
    this.isLastRotation = false;
  }
}

import { BlurFilter, Container, Sprite, Texture } from "pixi.js";
import { Ball } from "..";
import gsap from "gsap";
import { GameObjectEnums } from "../../enums/gameObjectEnums";

export class BallSelector extends Container {
  greenShadow!: Sprite;
  arrows!: Sprite;

  initialScaleX!: number;
  initialScaleY!: number;

  constructor(public ball: Ball) {
    super();

    this.initialScaleX = this.scale.x;
    this.initialScaleY = this.scale.y;

    this.addGreenShadow();
    this.addArrows();

    this.startArrowSpinAnimation();
    this.ball.addChild(this);
  }

  addGreenShadow() {
    this.greenShadow = new Sprite(
      Texture.from(GameAssets.images.greenSelector)
    );

    this.greenShadow.alpha = 0.6;
    this.greenShadow.anchor = 0.5;
    this.greenShadow.y = -0.2;
    this.greenShadow.width = 46;
    this.greenShadow.height = 46;

    this.addChild(this.greenShadow);
  }

  addArrows() {
    const blurFilter = new BlurFilter({
      strength: 1,
    });

    this.arrows = new Sprite(Texture.from(GameAssets.images.ballArrows));
    this.arrows.anchor = 0.5;

    this.arrows.filters = [blurFilter];

    this.arrows.width = 56;
    this.arrows.height = 56;
    this.addChild(this.arrows);
  }

  startArrowSpinAnimation() {
    gsap.to(this.arrows, {
      duration: 12,
      rotation: 3.14159,
      ease: "none",
      onComplete: () => {
        gsap.to(this.arrows, {
          duration: 12,
          rotation: 0,
          ease: "none",
          onComplete: () => {
            this.startArrowSpinAnimation();
          },
        });
      },
    });
    gsap.to(this.arrows.scale, {
      duration: 0.4,
      yoyo: true,
      x: this.arrows.scale.x + 0.002,
      y: this.arrows.scale.y + 0.002,
      repeat: -1,
      ease: "none",
    });
  }

  removeSelector() {
    gsap.to(this, {
      duration: 0.2,
      alpha: 0,
    });
  }

  reset() {
    this.scale.x = this.initialScaleX;
    this.scale.y = this.initialScaleY;
    this.addSelector();
  }

  addSelector() {
    gsap.to(this, {
      duration: 0.2,
      alpha: 1,
    });
  }
}

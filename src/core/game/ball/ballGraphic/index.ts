import { Container, Graphics, isMobile, Sprite, Texture } from "pixi.js";
import { Ball } from "..";

import { BallSelector } from "./ballSelector";
import gsap from "gsap";
import { GameView } from "../../GameView";
import { gameConfig } from "../../../config/gameConfig";
// import { BulgePinchFilter } from "pixi-filters";

export class BallGraphic {
  container!: Container;
  maskContainer!: Container;

  borderGraphic!: Graphics;

  ballSelector!: BallSelector;

  staticSprite!: Sprite;
  shadow!: Sprite;

  sahdowInitialPositionX!: number;
  sahdowInitialPositionY!: number;

  initialShadowX!: number;
  initialShadowY!: number;
  shadowInitialScale!: number;

  constructor(public ball: Ball, public gameView: GameView) {
    this.container = new Container();
    this.addInitSprites();
    this.addCircleMask();
    this.addShadow();
    this.addStaticSprite();

    this.offSpinMode();
    this.addBallSelector();
  }

  private addStaticSprite() {
    // const filter = new BulgePinchFilter({
    //   strength: 0.4,
    //   radius: 33,
    // });

    this.staticSprite = new Sprite(Texture.from(GameAssets.images.staticBall));
    this.staticSprite.anchor = 0.5;
    this.staticSprite.scale = 0.2;

    this.container.addChild(this.staticSprite);
    // this.staticSprite.filters = [filter];
  }

  addShadow() {
    this.shadow = new Sprite(Texture.from(GameAssets.images.ballShadow));
    this.shadow.anchor = 0.5;
    this.shadow.y = 13;

    this.shadow.scale = isMobile
      ? this.gameView.setScale(0.11)
      : this.gameView.setScale(0);
    this.shadow.zIndex = 0;

    this.initialShadowX = this.shadow.x;
    this.initialShadowY = this.shadow.y;
    this.shadowInitialScale = this.shadow.scale.x;

    this.ball.addChild(this.shadow);
  }

  removeShadow() {
    gsap.to(this.shadow.scale, {
      duration: 0.2,
      x: 0,
      y: 0,
    });
  }

  private addInitSprites() {
    for (let i = 0; i < 2; i++) {
      const sprite = new Sprite(Texture.from(GameAssets.images.ballTexture));
      sprite.anchor = 0.5;
      sprite.scale = 0.13;
      sprite.y = -i * sprite.height;

      this.container.addChild(sprite);
    }
  }

  private addCircleMask() {
    let mask = new Graphics()
      .circle(
        this.container.x,
        this.container.y,
        gameConfig.mobile.ball.maskSize
      )
      .fill();
    this.container.mask = mask;
    this.maskContainer = new Container();
    this.maskContainer.addChild(mask);
    this.container.addChild(this.maskContainer);
  }

  private addBallSelector() {
    this.ballSelector = new BallSelector(this.ball);
  }

  public onSpinMode() {
    // this.container.getChildAt(0).alpha = 1;
    // this.container.getChildAt(1).alpha = 1;
    this.staticSprite.alpha = 0;
  }

  public offSpinMode() {
    // this.container.getChildAt(0).alpha = 0;
    // this.container.getChildAt(1).alpha = 0;
    this.staticSprite.alpha = 1;
  }

  public removeSelector() {
    this.ballSelector.removeSelector();
  }
}

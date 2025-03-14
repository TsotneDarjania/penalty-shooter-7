import { Spine } from "@esotericsoftware/spine-pixi-v8";
import { Container } from "pixi.js";
import { GameView } from "../GameView";

export class Character extends Container {
  spine!: Spine;
  constructor(public gameview: GameView, initX: number, initY: number) {
    super();

    this.x = initX;
    this.y = initY;

    this.init();
    gameview.add(this);
  }

  init() {
    this.interactive = false;
    this.interactiveChildren = false;

    this.spine = Spine.from({
      skeleton: GameAssets.animations.character.json,
      atlas: GameAssets.animations.character.skeleton,
    });

    this.spine.scale = this.gameview.setScale(1.24);

    this.spine.state.setAnimation(0, "Idle", true);
    this.addChild(this.spine);
  }

  jump(direction: "left" | "right" | "center", height: 0 | 1 | 2) {
    this.scale.x = direction === "right" ? -1 : 1;

    let animationName =
      direction === "left" || direction === "right" ? "Side_" : "Center_";

    animationName += height;

    this.spine.state.setAnimation(0, animationName, false);
  }

  reset() {
    this.spine.state.setAnimation(0, "Idle", true);
  }
}

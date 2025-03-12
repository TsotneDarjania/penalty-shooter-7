import { Container, Sprite } from "pixi.js";
import { Spine } from "@esotericsoftware/spine-pixi-v8";

export class FootballDoor extends Container {
  door!: Container;
  topGrid!: Sprite;
  leftGrid!: Sprite;
  baseGrid!: Sprite;
  RightGrid!: Sprite;

  spine!: Spine;

  gridContainer: Container = new Container();

  constructor() {
    super();

    this.addDoor();
  }

  private addDoor() {
    this.door = new Container();

    this.spine = Spine.from({
      skeleton: GameAssets.animations.footballDoor.json,
      atlas: GameAssets.animations.footballDoor.skeleton,
    });

    this.spine.y = this.y + 97;
    this.spine.scale = 0.47;

    this.door.addChild(this.spine);

    this.spine.state.setAnimation(0, "Idle", true);
    this.spine.state.timeScale = 1.5;

    this.spine.state.addListener({
      complete: (entry) => {
        if (entry!.animation!.name !== "Idle") {
          this.spine.state.setAnimation(0, "Idle", true);
        }
      },
    });

    this.addChild(this.door);
  }

  playGridAnimation(point: [number, number]) {
    if (point[1] > 1) point[1] = 1;
    const animationName = `${point[0]}_${point[1]}`;
    this.spine.state.setAnimation(0, animationName, false);
  }

  playIdleAnimation() {
    this.spine.state.setAnimation(0, "Idle", true);
  }
}

import { Container, Graphics } from "pixi.js";
import { CustomSprite } from "../../../components/customSprite.ts";
import { CustomText } from "../../../components/customText.ts";
import { calculatePercentage } from "../../../../utils/scale";
import { GameView } from "../../GameView.ts";

export default class LoadingBar extends Container {
  fillWidth!: number;
  fillHeight!: number;

  background!: Graphics;
  fill!: Graphics;

  onAimLogo!: CustomSprite;

  text!: CustomText;

  constructor(public gameView: GameView) {
    super();
    this.fillWidth = calculatePercentage(70, gameView.width);
    this.fillHeight = 10;

    this.init();
  }

  private init() {
    this.addBackground();
    this.addFill();
  }

  private addBackground() {
    this.background = new Graphics();
    this.background.roundRect(
      -this.fillWidth / 2,
      0,
      this.fillWidth,
      this.fillHeight
    );
    this.background.fill(0x12a653);
    this.addChild(this.background);
  }

  addFill() {
    this.fill = new Graphics();
    this.fill.roundRect(-this.fillWidth / 2, 0, 0, this.fillHeight);
    this.fill.fill(0x06ed6e);

    this.addChild(this.fill);
  }

  updateFill(progress: number) {
    progress = Math.max(0, Math.min(1, progress));
    this.fill.roundRect(
      -this.fillWidth / 2,
      0,
      this.fillWidth * progress,
      this.fillHeight
    );
    this.fill.fill(0x06ed6e);
  }
}

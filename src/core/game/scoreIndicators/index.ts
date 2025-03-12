import { Container, Sprite, Texture } from "pixi.js";
import { GameView } from "../GameView";
import { GameInitData } from "../../../api/endpoints/initialDataEndpoint";
import { CustomSprite } from "../../components/customSprite";

export class ScoreIndicators extends Container {
  kicks: Sprite[] = [];

  kickIndicator = 0;
  kickImageWidth!: number;

  greenScores: Array<Sprite> = [];
  redScores: Array<Sprite> = [];

  constructor(public gameView: GameView, public initialData: GameInitData) {
    super();

    this.init();
  }

  reset() {
    this.kickIndicator = 0;
    this.greenScores.forEach((image) => {
      image.destroy();
      this.gameView.remove(image);
    });
    this.redScores.forEach((image) => {
      image.destroy();
      this.gameView.remove(image);
    });

    this.greenScores = [];
    this.redScores = [];
  }

  init() {
    const backgroundImage = new CustomSprite(
      GameAssets.images.scoresBackground,
      this.gameView.getScaledX(0.501),
      this.gameView.getScaledY(0.2)
    );
    // backgroundImage.width = 0;
    backgroundImage.scale.x = this.gameView.setScale(0.29);
    backgroundImage.scale.y = this.gameView.setScale(0.32);
    this.gameView.add(backgroundImage);
    this.displayKicks();

    if (this.initialData.hasActiveGame) {
      // Add correct Scores
      for (let i = 0; i < this.initialData.activeGameInfo!.goalsScored; i++) {
        this.addCorrectScore();
      }
      const totalKickNumber =
        this.initialData.activeGameInfo!.currentKickIndex +
        this.initialData.activeGameInfo!.kicksRemaining;

      const failedGoals =
        totalKickNumber -
        (this.initialData.activeGameInfo!.kicksRemaining +
          this.initialData.activeGameInfo!.goalsScored);

      for (let i = 0; i < failedGoals; i++) {
        this.addWrongScore();
      }
    }
  }

  addCorrectScore() {
    const greenScore = new Sprite(
      Texture.from(GameAssets.images.successScoreIcon)
    );
    this.greenScores.push(greenScore);
    greenScore.scale = this.gameView.setScale(0.05);
    greenScore.anchor = 0.5;

    const points = this.kicks[this.kickIndicator];
    greenScore.x = points.x;
    greenScore.y = points.y;

    this.gameView.add(greenScore);

    this.kickIndicator++;
  }

  addWrongScore() {
    const redScore = new Sprite(Texture.from(GameAssets.images.failScoreIcon));
    this.redScores.push(redScore);

    redScore.scale = this.gameView.setScale(0.05);
    redScore.anchor = 0.5;

    const points = this.kicks[this.kickIndicator];
    redScore.x = points.x;
    redScore.y = points.y;

    this.gameView.add(redScore);

    this.kickIndicator++;
  }

  displayKicks() {
    const kickImagesContainer = new Container();

    // const padding = calculatePercentage(2, this.scene.width);

    // let posX = 0;
    this.kickImageWidth = 0;

    if (this.initialData.gameConfigInfo.kicksCount === 3) {
      let kickImage_1 = new Sprite(
        Texture.from(GameAssets.images.defaultScoreIcon)
      );
      kickImage_1.x = this.gameView.getScaledX(0.3);
      kickImage_1.y = this.gameView.getScaledY(0.2);
      kickImage_1.scale = this.gameView.getScaledX(0.37);
      kickImage_1.anchor = 0.5;
      this.gameView.add(kickImage_1);
      this.kicks.push(kickImage_1);

      let kickImage_2 = new Sprite(
        Texture.from(GameAssets.images.defaultScoreIcon)
      );
      kickImage_2.x = this.gameView.getScaledX(0.5);
      kickImage_2.y = this.gameView.getScaledY(0.2);
      kickImage_2.scale = this.gameView.setScale(0.37);
      kickImage_2.anchor = 0.5;
      this.gameView.add(kickImage_2);
      this.kicks.push(kickImage_2);

      let kickImage_3 = new Sprite(
        Texture.from(GameAssets.images.defaultScoreIcon)
      );
      kickImage_3.x = this.gameView.getScaledX(0.7);
      kickImage_3.y = this.gameView.getScaledY(0.2);
      kickImage_3.scale = this.gameView.setScale(0.37);
      kickImage_3.anchor = 0.5;
      this.gameView.add(kickImage_3);
      this.kicks.push(kickImage_3);
    }

    if (this.initialData.gameConfigInfo.kicksCount === 2) {
      let kickImage_1 = new Sprite(
        Texture.from(GameAssets.images.defaultScoreIcon)
      );
      kickImage_1.x = this.gameView.getScaledX(0.43);
      kickImage_1.y = this.gameView.getScaledY(0.2);
      kickImage_1.scale = this.gameView.setScale(0.37);
      kickImage_1.anchor = 0.5;
      this.gameView.add(kickImage_1);
      this.kicks.push(kickImage_1);

      let kickImage_2 = new Sprite(
        Texture.from(GameAssets.images.defaultScoreIcon)
      );
      kickImage_2.x = this.gameView.getScaledX(0.57);
      kickImage_2.y = this.gameView.getScaledY(0.2);
      kickImage_2.scale = this.gameView.setScale(0.37);
      kickImage_2.anchor = 0.5;
      this.gameView.add(kickImage_2);
      this.kicks.push(kickImage_2);
    }

    if (this.initialData.gameConfigInfo.kicksCount === 1) {
      let kickImage_1 = new Sprite(
        Texture.from(GameAssets.images.defaultScoreIcon)
      );
      kickImage_1.x = this.gameView.getScaledX(0.5);
      kickImage_1.y = this.gameView.getScaledY(0.2);
      kickImage_1.scale = this.gameView.setScale(0.37);
      kickImage_1.anchor = 0.5;
      this.gameView.add(kickImage_1);
      this.kicks.push(kickImage_1);
    }

    if (this.initialData.gameConfigInfo.kicksCount === 4) {
      let kickImage_1 = new Sprite(
        Texture.from(GameAssets.images.defaultScoreIcon)
      );
      kickImage_1.x = this.gameView.getScaledX(0.3);
      kickImage_1.y = this.gameView.getScaledY(0.2);
      kickImage_1.scale = this.gameView.setScale(0.37);
      kickImage_1.anchor = 0.5;
      this.gameView.add(kickImage_1);
      this.kicks.push(kickImage_1);

      let kickImage_2 = new Sprite(
        Texture.from(GameAssets.images.defaultScoreIcon)
      );
      kickImage_2.x = this.gameView.getScaledX(0.433);
      kickImage_2.y = this.gameView.getScaledY(0.2);
      kickImage_2.scale = this.gameView.setScale(0.37);
      kickImage_2.anchor = 0.5;
      this.gameView.add(kickImage_2);
      this.kicks.push(kickImage_2);

      let kickImage_3 = new Sprite(
        Texture.from(GameAssets.images.defaultScoreIcon)
      );
      kickImage_3.x = this.gameView.getScaledX(0.565);
      kickImage_3.y = this.gameView.getScaledY(0.2);
      kickImage_3.scale = this.gameView.setScale(0.37);
      kickImage_3.anchor = 0.5;
      this.gameView.add(kickImage_3);
      this.kicks.push(kickImage_3);

      let kickImage_4 = new Sprite(
        Texture.from(GameAssets.images.defaultScoreIcon)
      );
      kickImage_4.x = this.gameView.getScaledX(0.7);
      kickImage_4.y = this.gameView.getScaledY(0.2);
      kickImage_4.scale = this.gameView.setScale(0.37);
      kickImage_4.anchor = 0.5;
      this.gameView.add(kickImage_4);
      this.kicks.push(kickImage_4);
    }

    if (this.initialData.gameConfigInfo.kicksCount === 5) {
      let kickImage_1 = new Sprite(
        Texture.from(GameAssets.images.defaultScoreIcon)
      );
      kickImage_1.x = this.gameView.getScaledX(0.26);
      kickImage_1.y = this.gameView.getScaledY(0.2);
      kickImage_1.scale = this.gameView.setScale(0.37);
      kickImage_1.anchor = 0.5;
      this.gameView.add(kickImage_1);
      this.kicks.push(kickImage_1);

      let kickImage_2 = new Sprite(
        Texture.from(GameAssets.images.defaultScoreIcon)
      );
      kickImage_2.x = this.gameView.getScaledX(0.382);
      kickImage_2.y = this.gameView.getScaledY(0.2);
      kickImage_2.scale = this.gameView.setScale(0.37);
      kickImage_2.anchor = 0.5;
      this.gameView.add(kickImage_2);
      this.kicks.push(kickImage_2);

      let kickImage_3 = new Sprite(
        Texture.from(GameAssets.images.defaultScoreIcon)
      );
      kickImage_3.x = this.gameView.getScaledX(0.5);
      kickImage_3.y = this.gameView.getScaledY(0.2);
      kickImage_3.scale = this.gameView.setScale(0.37);
      kickImage_3.anchor = 0.5;
      this.gameView.add(kickImage_3);
      this.kicks.push(kickImage_3);

      let kickImage_4 = new Sprite(
        Texture.from(GameAssets.images.defaultScoreIcon)
      );
      kickImage_4.x = this.gameView.getScaledX(0.623);
      kickImage_4.y = this.gameView.getScaledY(0.2);
      kickImage_4.scale = this.gameView.setScale(0.37);
      kickImage_4.anchor = 0.5;
      this.gameView.add(kickImage_4);
      this.kicks.push(kickImage_4);

      let kickImage_5 = new Sprite(
        Texture.from(GameAssets.images.defaultScoreIcon)
      );
      kickImage_5.x = this.gameView.getScaledX(0.744);
      kickImage_5.y = this.gameView.getScaledY(0.2);
      kickImage_5.scale = this.gameView.setScale(0.37);
      kickImage_5.anchor = 0.5;
      this.gameView.add(kickImage_5);
      this.kicks.push(kickImage_5);
    }

    // for (let i = 0; i < initialData.gameConfigInfo.kicksCount; i++) {
    //   let kickImage = new Sprite(
    //     Texture.from(GameObjectEnums.defaul_score_ball)
    //   );

    //   kickImage.scale = getScaleX(0.05);
    //   kickImage.anchor = 0.5;
    //   kickImagesContainer.addChild(kickImage);
    //   this.kickImageWidth = kickImage.width;

    //   this.kicks.push(kickImage);

    //   kickImage.x = posX;
    //   posX += kickImage.width + padding;
    // }

    kickImagesContainer.x = -kickImagesContainer.width / 2;
    kickImagesContainer.x += this.kickImageWidth / 2;

    this.addChild(kickImagesContainer);
  }
}

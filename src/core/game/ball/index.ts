import { Container, EventEmitter, Point } from "pixi.js";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { BallGraphic } from "./ballGraphic";
import { SpinManager } from "./spinManager";
import { ShootManager } from "./shootManager";
import { ScaleManager } from "./scaleManager";
import { BlurManager } from "./blurManager";
import gsap from "gsap";
import { GameEventEnums } from "../enums/gameEvenetEnums";
import { GameView } from "../GameView";
import { adjustSVGPath } from "../helper";

gsap.registerPlugin(MotionPathPlugin);

export class Ball extends Container {
  ballGraphic!: BallGraphic;
  spinManager!: SpinManager;
  shootManager!: ShootManager;
  scaleManager!: ScaleManager;
  blurManager!: BlurManager;
  eventEmitter!: EventEmitter;

  isGoal = false;

  ballFallinDownRawPathData!: {
    path: string;
    offsetX: number;
    offsetY: number;
  };

  constructor(
    public initialX: number,
    public initialY: number,
    public initialScale: number,
    public gameView: GameView
  ) {
    super();

    this.x = initialX;
    this.y = initialY;
    this.scale = initialScale;

    this.init();
  }

  private init() {
    this.createGraphic();
    this.creatSpinManager();
    this.createShootManager();
    this.createScaleManager();
    this.createBlurManager();

    this.addEventEmitter();
    this.addEvenetListeners();
  }

  private addEvenetListeners() {
    this.eventEmitter.on("FinishShoot", () => {
      this.spinManager.stopRotation();
      this.blurManager.removeBlurEffect();
      this.eventEmitter.emit(GameEventEnums.ballTouchGoalKeeperOrGrid);

      gsap.to(this.ballGraphic.shadow.scale, {
        duration: 0.8,
        x:
          window.innerWidth > 500 && window.innerHeight > 800
            ? this.gameView.setScale(0.04)
            : this.gameView.setScale(0.07),
        y:
          window.innerWidth > 500 && window.innerHeight > 800
            ? this.gameView.setScale(0.04)
            : this.gameView.setScale(0.07),
        ease: "bounce.out",
      });
      this.fallDown();
    });
  }

  private createGraphic() {
    this.ballGraphic = new BallGraphic(this, this.gameView);
    this.addChild(this.ballGraphic.container);
  }

  private creatSpinManager() {
    this.spinManager = new SpinManager(
      [
        this.ballGraphic.container.getChildAt(0),
        this.ballGraphic.container.getChildAt(1),
      ],
      this
    );
  }

  private createShootManager() {
    this.shootManager = new ShootManager(this);
  }

  private createScaleManager() {
    this.scaleManager = new ScaleManager(this);
  }

  private createBlurManager() {
    this.blurManager = new BlurManager(this);
  }

  private addEventEmitter() {
    this.eventEmitter = new EventEmitter();
  }

  public shoot(points: { x: number; y: number }) {
    this.shootManager.shoot({
      x: points.x,
      y: points.y,
    });
    this.scaleManager.startScaleAnimationDuringShoot();
    this.ballGraphic.removeSelector();
    this.ballGraphic.removeShadow();

    setTimeout(() => {
      this.eventEmitter.emit(GameEventEnums.isTimeToJumpGoalKeeper);
    }, 50);
  }

  public selectForShoot(): void {
    this.ballGraphic.onSpinMode();
    this.spinManager.startSpin();
    this.scaleManager.increaseScaleForShoot();
    this.blurManager.makeItBlur();
  }

  private fallDown() {
    // Adjust the path relative to the target's current position
    const scale: number = 2; // Define the scale factor
    const scaledAndOffsetPath: string = adjustSVGPath(
      this.ballFallinDownRawPathData.path,
      this.ballGraphic.container.x + this.ballFallinDownRawPathData.offsetX,
      this.ballGraphic.container.y + this.ballFallinDownRawPathData.offsetY,
      scale
    );

    const pathPoints = MotionPathPlugin.stringToRawPath(scaledAndOffsetPath);
    const lastPoint = pathPoints[pathPoints.length - 1];

    gsap.to(this.ballGraphic.container, {
      duration: 0.7,
      motionPath: {
        path: scaledAndOffsetPath,
        curviness: 1.5, // Controls the smoothness of the curve
      },
      onUpdate: () => {
        this.ballGraphic.shadow.x = lastPoint[lastPoint.length - 2];
        this.ballGraphic.shadow.y = lastPoint[lastPoint.length - 1] + 8;
      },
      ease: "bounce.out",
      onComplete: () => {
        this.eventEmitter.emit(GameEventEnums.finishFallingOfBall);
      },
    });
  }

  public reset() {
    this.isGoal = false;
    this.ballGraphic.offSpinMode();

    const ballStartPoint = this.toLocal(
      new Point(this.initialX, this.gameView.getScaledY(0))
    );
    const ballDestinationPoints = this.toLocal(
      new Point(this.initialX, this.initialY)
    );

    this.ballGraphic.container.x = ballDestinationPoints.x;
    this.ballGraphic.container.y = ballStartPoint.y;

    gsap.to(this.ballGraphic.shadow, {
      duration: 0.4,
      alpha: 1,
      ease: "power2",
    });

    gsap.to(this.ballGraphic.container.scale, {
      duration: 0.1,
      x: 1,
      y: 1,
      ease: "power2",
    });

    this.ballGraphic.shadow.x = this.ballGraphic.initialShadowX;
    this.ballGraphic.shadow.y = this.ballGraphic.initialShadowY;
    gsap.to(this.ballGraphic.shadow.scale, {
      duration: 0.8,
      x: this.ballGraphic.shadowInitialScale,
      y: this.ballGraphic.shadowInitialScale,
      ease: "bounce.out",
    });

    gsap.to(this.ballGraphic.container, {
      duration: 0.8,
      y: ballDestinationPoints.y,
      ease: "bounce.out",
      onComplete: () => {
        this.ballGraphic.ballSelector.reset();
        this.eventEmitter.emit(GameEventEnums.ballIsReadyForShoot);
      },
    });
  }
}

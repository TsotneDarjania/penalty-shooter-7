import { EventEmitter, Sprite, Texture } from "pixi.js";
import gsap from "gsap";
import { FootballDoor } from "../footballDoor";
import { GameView } from "../GameView";
import { createKey, findClosestPoint, getRandomIntInRange } from "../helper";
import { GameEventEnums } from "../enums/gameEvenetEnums";

export type pointsType = Map<
  string,
  {
    x: number;
    y: number;
    targetImage?: Sprite;
    succesGoalKeeperJumpData: {
      direction: "center" | "left" | "right";
      height: 0 | 1 | 2;
    };
    failGoalKeeperJumpData: {
      direction: "center" | "left" | "right";
      height: 0 | 1 | 2;
    };
    ball: {
      isSave: {
        fallingDawnPath: string;
      };
      isNotSave: {
        fallingDawnPath: string;
      };
      fallingDawnPathData: {
        offsetX: number;
        offsetY: number;
      };
    };
  }
>;

export class DoorTargetPoints {
  continueTargetAnimations = true;
  isTargetsOnn = false;
  gsapTargetAnimation!: gsap.core.Tween;

  selectedPoint: string | undefined = undefined;

  eventEmitter!: EventEmitter;

  points: pointsType = new Map();

  constructor(public footballDor: FootballDoor, public gameView: GameView) {
    this.eventEmitter = new EventEmitter();

    this.generateTargetPoints();
    this.addTargets();
    this.addListeners();
  }

  addListeners() {
    this.footballDor.door.interactive = true;
    this.footballDor.door.cursor = "pointer";
    this.footballDor.door.on("pointerdown", (event: { global: any }) => {
      const mousePosition = event.global;

      const targetPoint = {
        x: mousePosition.x,
        y: mousePosition.y,
      };

      const points = Array.from(this.points.values()).map((point) => {
        return { x: point.x, y: point.y };
      });

      const closestPoint = findClosestPoint(points, targetPoint);

      const selectedPoint = Array.from(this.points.entries()).filter(
        (point) => {
          return point[1].x === closestPoint.x && point[1].y === closestPoint.y;
        }
      );

      this.selectedPoint = String(selectedPoint.map((point) => point[0]));

      this.eventEmitter.emit(GameEventEnums.selectedShootByDoorClick);
    });
    this.footballDor.door.on("pointerup", (event: { global: any }) => {
      const mousePosition = event.global;

      const targetPoint = {
        x: mousePosition.x,
        y: mousePosition.y,
      };

      const points = Array.from(this.points.values()).map((point) => {
        return { x: point.x, y: point.y };
      });

      const closestPoint = findClosestPoint(points, targetPoint);

      const selectedPoint = Array.from(this.points.entries()).filter(
        (point) => {
          return point[1].x === closestPoint.x && point[1].y === closestPoint.y;
        }
      );

      this.selectedPoint = String(selectedPoint.map((point) => point[0]));

      this.eventEmitter.emit(GameEventEnums.selectedShootByDoorClick);
    });
  }

  generateTargetPoints() {
    this.points.set(createKey([0, 0]), {
      x: this.gameView.getPositionX(0.21),
      y: this.gameView.getPositionY(0.52),
      succesGoalKeeperJumpData: {
        direction: "left",
        height: 0,
      },
      failGoalKeeperJumpData: {
        direction: "center",
        height: getRandomIntInRange(0, 2) as 0 | 1 | 2,
      },
      ball: {
        isSave: {
          fallingDawnPath:
            "M -7 -12 L -41 -23 L -75 -4 L -108 34 L -164 78 M -101 -24",
        },
        isNotSave: {
          fallingDawnPath:
            "M -8 -14 L -6 -15 L -5 -13 L -6 -11 L -7 -10 M -101 -24",
        },
        fallingDawnPathData: {
          offsetX: 16,
          offsetY: 18,
        },
      },
    });

    this.points.set(createKey([0, 1]), {
      x: this.gameView.getPositionX(0.18),
      y: this.gameView.getPositionY(0.45),
      succesGoalKeeperJumpData: {
        direction: "left",
        height: 1,
      },
      failGoalKeeperJumpData: {
        direction: "center",
        height: getRandomIntInRange(0, 2) as 0 | 1 | 2,
      },
      ball: {
        isSave: {
          fallingDawnPath:
            "M 0 -19 L -1 -14 L -3 -12 L -7 -7 L -26 0 M -101 -24",
        },
        isNotSave: {
          fallingDawnPath: "M 0 -19 L 0 -15 L 0 -10 L 1 -6 L 2 -4 M -101 -24",
        },
        fallingDawnPathData: {
          offsetX: 1,
          offsetY: 35,
        },
      },
    });

    this.points.set(createKey([0, 2]), {
      x: this.gameView.getPositionX(0.19),
      y: this.gameView.getPositionY(0.38),
      succesGoalKeeperJumpData: {
        direction: "left",
        height: 2,
      },
      failGoalKeeperJumpData: {
        direction: "right",
        height: getRandomIntInRange(0, 2) as 0 | 1 | 2,
      },
      ball: {
        isSave: {
          fallingDawnPath:
            "M 0 -19 L -4 -15 L -10 -14 L -18 -13 L -39 -2 M -101 -24",
        },
        isNotSave: {
          fallingDawnPath:
            "M 0 -19 L -2 -20 L -2 -17 L -1 -11 L 2 5 M -101 -24",
        },
        fallingDawnPathData: {
          offsetX: 5,
          offsetY: 36,
        },
      },
    });

    this.points.set(createKey([1, 0]), {
      x: this.gameView.getPositionX(0.5),
      y: this.gameView.getPositionY(0.53),
      succesGoalKeeperJumpData: {
        direction: "center",
        height: 0,
      },
      failGoalKeeperJumpData: {
        direction: "left",
        height: getRandomIntInRange(0, 2) as 0 | 1 | 2,
      },
      ball: {
        isSave: {
          fallingDawnPath:
            "M -8 -17 L -7 -19 L -6 -18 L -5 -15 L -4 -7 M -101 -24",
        },
        isNotSave: {
          fallingDawnPath:
            "M -8 -17 L -7 -19 L -6 -16 L -7 -14 L -7 -11 M -101 -24",
        },
        fallingDawnPathData: {
          offsetX: 17,
          offsetY: 21,
        },
      },
    });

    this.points.set(createKey([1, 1]), {
      x: this.gameView.getPositionX(0.5),
      y: this.gameView.getPositionY(0.47),
      succesGoalKeeperJumpData: {
        direction: "center",
        height: 1,
      },
      failGoalKeeperJumpData: {
        direction: "right",
        height: getRandomIntInRange(0, 2) as 0 | 1 | 2,
      },
      ball: {
        isSave: {
          fallingDawnPath:
            "M -8 -17 L -10 -19 L -13 -16 L -16 -9 L -20 16 M -101 -24",
        },
        isNotSave: {
          fallingDawnPath:
            "M -8 -17 L -7 -19 L -6 -15 L -6 -9 L -8 -2 M -101 -24",
        },
        fallingDawnPathData: {
          offsetX: 16,
          offsetY: 22,
        },
      },
    });

    this.points.set(createKey([1, 2]), {
      x: this.gameView.getPositionX(0.5),
      y: this.gameView.getPositionY(0.36),
      succesGoalKeeperJumpData: {
        direction: "center",
        height: 2,
      },
      failGoalKeeperJumpData: {
        direction: "left",
        height: getRandomIntInRange(0, 2) as 0 | 1 | 2,
      },
      ball: {
        isSave: {
          fallingDawnPath: "M 0 -19 L 1 -20 L 3 -16 L 5 -4 L 1 20 M -101 -24",
        },
        isNotSave: {
          fallingDawnPath: "M 0 -19 L 0 -15 L 0 -8 L -1 1 L -1 10 M -101 -24",
        },
        fallingDawnPathData: {
          offsetX: 6,
          offsetY: 30,
        },
      },
    });

    this.points.set(createKey([2, 0]), {
      x: this.gameView.getPositionX(0.79),
      y: this.gameView.getPositionY(0.52),
      succesGoalKeeperJumpData: {
        direction: "right",
        height: 0,
      },
      failGoalKeeperJumpData: {
        direction: "left",
        height: getRandomIntInRange(0, 2) as 0 | 1 | 2,
      },
      ball: {
        isSave: {
          fallingDawnPath:
            "M -7 -12 L 25 -24 L 51 -10 L 87 20 L 115 68 M -101 -24",
        },
        isNotSave: {
          fallingDawnPath:
            "M -8 -17 L -7 -19 L -6 -16 L -7 -14 L -6 -11 M -101 -24",
        },
        fallingDawnPathData: {
          offsetX: 18,
          offsetY: 28,
        },
      },
    });

    this.points.set(createKey([2, 1]), {
      x: this.gameView.getPositionX(0.82),
      y: this.gameView.getPositionY(0.445),
      succesGoalKeeperJumpData: {
        direction: "right",
        height: 1,
      },
      failGoalKeeperJumpData: {
        direction: "center",
        height: getRandomIntInRange(0, 2) as 0 | 1 | 2,
      },
      ball: {
        isSave: {
          fallingDawnPath:
            "M -7 -12 L 31 -26 L 80 -7 L 131 49 L 263 212 M -101 -24",
        },
        isNotSave: {
          fallingDawnPath: "M 0 -19 L 1 -15 L 0 -12 L -1 -9 L -3 -5 M -101 -24",
        },
        fallingDawnPathData: {
          offsetX: 5,
          offsetY: 31,
        },
      },
    });

    this.points.set(createKey([2, 2]), {
      x: this.gameView.getPositionX(0.815),
      y: this.gameView.getPositionY(0.38),
      succesGoalKeeperJumpData: {
        direction: "right",
        height: 2,
      },
      failGoalKeeperJumpData: {
        direction: "center",
        height: getRandomIntInRange(0, 2) as 0 | 1 | 2,
      },
      ball: {
        isSave: {
          fallingDawnPath:
            "M -7 -12 L 33 -25 L 90 -11 L 196 49 L 450 138 M -101 -24",
        },
        isNotSave: {
          fallingDawnPath: "M 0 -19 L 1 -15 L 0 -8 L 0 -3 L -1 6 M -101 -24",
        },
        fallingDawnPathData: {
          offsetX: 4,
          offsetY: 35,
        },
      },
    });
  }

  addTargets() {
    this.points.forEach((point) => {
      const sprite = new Sprite(
        Texture.from(GameAssets.images.footballDoorTargetSVG)
      );
      sprite.x = point.x;
      sprite.y = point.y;
      sprite.scale.set(this.gameView.setScale(0.4));

      sprite.anchor = 0.5;
      sprite.alpha = 0;
      sprite.zIndex = 10;

      this.gameView.add(sprite);

      point.targetImage = sprite;
    });
  }

  lightOnnTargets() {
    if (this.isTargetsOnn) return;

    this.isTargetsOnn = true;

    const targetImages = Array.from(this.points.values())
      .map((point) => point.targetImage)
      .filter((sprite) => sprite !== undefined) as Sprite[];

    targetImages.forEach((image) => {
      gsap.to(image.scale, {
        x: image.scale.x + 0.03,
        y: image.scale.y + 0.03,
        repeat: -1,
        yoyo: true,
        duration: 0.2,
        ease: "none",
      });
    });

    this.animateTargets(targetImages);
  }

  animateTargets(images: Sprite[]) {
    images.forEach((image, index) => {
      gsap.to(image, {
        alpha: 0.6,
        delay: 0.1 * index,
        duration: 1.8,
        onComplete: () => {
          if (index === images.length - 1) {
            this.aniamteToHideTargets();
          }
        },
        ease: "power4.inOut",
      });
    });
  }

  aniamteToHideTargets() {
    const targetImages = Array.from(this.points.values())
      .map((point) => point.targetImage)
      .filter((sprite) => sprite !== undefined) as Sprite[];

    targetImages.forEach((image, index) => {
      gsap.to(image, {
        alpha: 0,
        delay: 0.1 * index,
        duration: 1,
        onComplete: () => {
          if (index === 0) {
            this.continueTargetAnimations && this.animateTargets(targetImages);
          }
        },
        ease: "power4.inOut",
      });
    });
  }

  lightoffTargets() {
    this.continueTargetAnimations = false;
  }
}

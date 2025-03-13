import {
  convertAssets,
  extractAssetProperties,
  LoadConfigType,
} from "./loadConfig";

export const assets: LoadConfigType = {
  music: {
    theme: {
      src: "/assets/musics/theme.mp3",
      data: {
        loop: true,
      },
    },
    ballShoot: {
      src: "/assets/musics/ball-shoot.wav",
      data: {
        loop: true,
      },
    },
    saveCenter: {
      src: "/assets/musics/save-center.wav",
      data: {
        loop: true,
      },
    },
    saveLeft: {
      src: "/assets/musics/save-left.wav",
      data: {
        loop: true,
      },
    },
    saveRight: {
      src: "/assets/musics/save-right.wav",
      data: {
        loop: true,
      },
    },
    goalRight: {
      src: "/assets/musics/goalright.wav",
      data: {
        loop: true,
      },
    },
    goalLeft: {
      src: "/assets/musics/goalleft.wav",
      data: {
        loop: true,
      },
    },
    goalCenter: {
      src: "/assets/musics/goalcenter.wav",
      data: {
        loop: true,
      },
    },
  },
  video: {
    background: {
      src: "../assets/videos/background.webm",
      data: { loop: true },
    },
  },
  images: {
    test: {
      src: "../assets/test.png",
      data: {
        scaleMode: "linear",
        autoGenerateMipMaps: true,
      },
    },
    background: {
      src: "../assets/images/background.png",
      data: {
        scaleMode: "linear",
        autoGenerateMipMaps: true,
      },
    },
    onAimLogo: {
      src: "../assets/images/onaim-logo.png",
      data: {
        scaleMode: "linear",
        autoGenerateMipMaps: true,
      },
    },
    defaultWhiteImage: {
      src: "../assets/images/default-white-image.png",
      data: {
        scaleMode: "linear",
        autoGenerateMipMaps: true,
      },
    },
    ballTexture: {
      src: "../assets/images/ball-texture.png",
      data: {
        scaleMode: "linear",
        autoGenerateMipMaps: true,
      },
    },
    ballShadow: {
      src: "../assets/images/ball-shadow.png",
      data: {
        scaleMode: "linear",
        autoGenerateMipMaps: true,
      },
    },
    staticBall: {
      src: "../assets/images/static-ball.png",
      data: {
        scaleMode: "linear",
        autoGenerateMipMaps: true,
      },
    },
    greenSelector: {
      src: "../assets/images/green-selector.png",
      data: {
        scaleMode: "linear",
        autoGenerateMipMaps: true,
      },
    },
    ballArrows: {
      src: "../assets/images/ball-arrows.png",
      data: {
        scaleMode: "linear",
        autoGenerateMipMaps: true,
      },
    },
    defaultScoreIcon: {
      src: "../assets/images/score-indicators/default.png",
      data: {
        scaleMode: "linear",
        autoGenerateMipMaps: true,
      },
    },
    scoresBackground: {
      src: "../assets/images/score-indicators/scores-background.png",
      data: {
        scaleMode: "linear",
        autoGenerateMipMaps: true,
      },
    },
    footballDoorTargetSVG: {
      src: "../assets/images/target.svg",
      data: {
        scaleMode: "linear",
        autoGenerateMipMaps: true,
      },
    },
    failScoreIcon: {
      src: "../assets/images/score-indicators/fail-red.png",
      data: {
        scaleMode: "linear",
        autoGenerateMipMaps: true,
      },
    },
    successScoreIcon: {
      src: "../assets/images/score-indicators/success-green.png",
      data: {
        scaleMode: "linear",
        autoGenerateMipMaps: true,
      },
    },
    mouseRopeEffect: {
      src: "../assets/images/mouse-rope-effect.png",
      data: {
        scaleMode: "linear",
        autoGenerateMipMaps: true,
      },
    },
    winCircle: {
      src: "../assets/images/win-circle.svg",
      data: {
        scaleMode: "linear",
        autoGenerateMipMaps: true,
      },
    },
    loseCircle: {
      src: "../assets/images/lose-circle.svg",
      data: {
        scaleMode: "linear",
        autoGenerateMipMaps: true,
      },
    },
  },
  animations: {
    footballDoor: {
      json: {
        src: "../assets/animations/footballDoor/skeleton.json",
        data: {
          blendMode: "difference",
        },
      },
      skeleton: {
        src: "../assets/animations/footballDoor/skeleton.atlas",
        data: {
          blendMode: "difference",
        },
      },
    },
    character: {
      json: {
        src: "../assets/animations/character/Personality.json",
        data: {
          blendMode: "difference",
        },
      },
      skeleton: {
        src: "../assets/animations/character/Personality.atlas",
        data: {
          blendMode: "difference",
        },
      },
    },
  },
};

export const gameAssets = extractAssetProperties(assets);

globalThis.LoadConfig = assets;
globalThis.GameAssets = convertAssets(assets);

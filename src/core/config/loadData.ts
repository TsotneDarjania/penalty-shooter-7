import {
  convertAssets,
  extractAssetProperties,
  LoadConfigType,
} from "./loadConfig";

export const assets: LoadConfigType = {
  images: {
    background: {
      src: "../assets/images/background.jpg",
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
    test: {
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
  },
  animations: {
    line: {
      json: {
        src: "../assets/animations/line/skeleton.json",
        data: {
          scaleMode: "linear",
          autoGenerateMipMaps: true,
        },
      },
      skeleton: {
        src: "../assets/animations/line/skeleton.atlas",
        data: {
          scaleMode: "linear",
          autoGenerateMipMaps: true,
        },
      },
    },
    symbols: {
      vine: {
        json: {
          src: "../assets/animations/wine/gvino.json",
          data: {
            scaleMode: "linear",
            autoGenerateMipMaps: true,
          },
        },
        skeleton: {
          src: "../assets/animations/wine/gvino.atlas",
          data: {
            scaleMode: "linear",
            autoGenerateMipMaps: true,
          },
        },
      },
    },
  },
};

export const gameAssets = extractAssetProperties(assets);

globalThis.LoadConfig = assets;
globalThis.GameAssets = convertAssets(assets);

import {
    convertAssets,
    extractAssetProperties,
    LoadConfigType,
} from "./loadConfig";

export const assets: LoadConfigType = {
    images: {
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
        }
    }
};

export const gameAssets = extractAssetProperties(assets);

globalThis.LoadConfig = assets;
globalThis.GameAssets = convertAssets(assets);
import { boardDataType } from "../board";

export const boardDataConfig: boardDataType = {
  reelsCount: 3,
  symbolsPerReel: 3,
  spinDelayBetweenReels: 100,
  symbolKeys: [
    GameAssets.animations.symbols.wine.json,
    GameAssets.animations.symbols.crown.json,
    GameAssets.animations.symbols.coin.json,
    GameAssets.animations.symbols.ring_4.json,
    GameAssets.animations.symbols.ring_2.json,
    GameAssets.animations.symbols.ring_3.json,
    GameAssets.animations.symbols.ring_1.json,
    GameAssets.animations.symbols.arpa.json,
  ],
  initCombination: [
    [0, 1, 1],
    [3, 4, 5],
    [6, 7, 0],
  ],
  config: {
    symbolTextureOriginalWidth: 530,
    symbolTextureOriginalHeight: 964,
  },
  padding: 0,
  spinDuration: 0.11,
  spinStyle: "classic",
};

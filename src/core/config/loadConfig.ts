declare global {
  var LoadConfig: LoadConfigType;
  var GameAssets: AssetsType;
}

type ReplaceAssetTypeWithString<T> = T extends AssetType
  ? string
  : T extends object
  ? { [K in keyof T]: ReplaceAssetTypeWithString<T[K]> }
  : T;

type AssetsType = ReplaceAssetTypeWithString<LoadConfigType>;

export type LoadConfigType = {
  music: {
    theme: AssetType;
    reelDrop: AssetType;
    drySpin: AssetType;
    stopSpin: AssetType;
    uiOtherButtons: AssetType;
    win: AssetType;
    spin: AssetType;
  };
  video: {
    background: AssetType;
  };
  images: {
    test: AssetType;
    background: AssetType;
    onAimLogo: AssetType;
    defaultWhiteImage: AssetType;
  };
  animations: {
    line: SpineAssetsType;
    symbols: {
      wine: SpineAssetsType;
      crown: SpineAssetsType;
      coin: SpineAssetsType;
      ring_4: SpineAssetsType;
      ring_3: SpineAssetsType;
      ring_2: SpineAssetsType;
      ring_1: SpineAssetsType;
      arpa: SpineAssetsType;
    };
  };
};

type AssetType = {
  src: string;
  data: object;
};

type SpineAssetsType = {
  json: AssetType;
  skeleton: AssetType;
};

// Minimal helper that walks through the config and,
// whenever it sees an object matching AssetType, returns its src.
export function convertAssets<T>(value: T): ReplaceAssetTypeWithString<T> {
  if (value && typeof value === "object") {
    // Check if this object is an AssetType (by checking for 'src' and 'data')
    if ("src" in value && "data" in value) {
      return (value as AssetType).src as ReplaceAssetTypeWithString<T>;
    }
    const result: any = Array.isArray(value) ? [] : {};
    for (const key in value) {
      result[key] = convertAssets(value[key]);
    }
    return result;
  }
  return value as ReplaceAssetTypeWithString<T>;
}

export function extractAssetProperties(obj: any): AssetType[] {
  let assets: AssetType[] = [];
  if (obj && typeof obj === "object") {
    // Check if the object matches AssetType by verifying it has a 'src' (string) and 'data' property.
    if ("src" in obj && typeof obj.src === "string" && "data" in obj) {
      assets.push(obj as AssetType);
    } else {
      // Otherwise, iterate over each property.
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          assets = assets.concat(extractAssetProperties(obj[key]));
        }
      }
    }
  }
  return assets;
}

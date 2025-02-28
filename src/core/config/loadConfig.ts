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
    background: {
      src: string;
      data: any
    },
    uiOtherButtons: {
      src: string;
      data: any;
    }
  },
  video: {
    background: {
      src: string;
      data: any;
    };
  };
  images: {
    background: {
      src: string;
      data: any;
    };
    onAimLogo: {
      src: string;
      data: any;
    };
    defaultWhiteImage: {
      src: string;
      data: any;
    };
  };
  animations: {
    line: {
      json: {
        src: string;
        data: any;
      };
      skeleton: {
        src: string;
        data: any;
      };
    };
    symbols: {
      wine: {
        json: {
          src: string;
          data: any;
        };
        skeleton: {
          src: string;
          data: any;
        };
      };
      crown: {
        json: {
          src: string;
          data: any;
        };
        skeleton: {
          src: string;
          data: any;
        };
      };
      coin: {
        json: {
          src: string;
          data: any;
        };
        skeleton: {
          src: string;
          data: any;
        };
      };
      ring_4: {
        json: {
          src: string;
          data: any;
        };
        skeleton: {
          src: string;
          data: any;
        };
      };
      ring_3: {
        json: {
          src: string;
          data: any;
        };
        skeleton: {
          src: string;
          data: any;
        };
      };
      ring_2: {
        json: {
          src: string;
          data: any;
        };
        skeleton: {
          src: string;
          data: any;
        };
      };
      ring_1: {
        json: {
          src: string;
          data: any;
        };
        skeleton: {
          src: string;
          data: any;
        };
      };
      arpa: {
        json: {
          src: string;
          data: any;
        };
        skeleton: {
          src: string;
          data: any;
        };
      };
    };
  };
};

type AssetType = {
  src: string;
  data: object;
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

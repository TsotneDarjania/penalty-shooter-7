import {Assets, Container, Graphics} from "pixi.js";
import LoadingBar from "./loadingBar";

export type AssetInfo = {
    src: string;
    data?: {
        scaleMode?: string;
        autoGenerateMipMaps?: boolean;
        resolution?: number;
    };
};

export class GameLoader extends Container {
    public loadingBar!: LoadingBar;

    constructor(public _width: number, public _height: number) {
        super()

        this.addPreBackground();
        this.loadingBar = new LoadingBar(this._width, this._height);
        this.addChild(this.loadingBar);

    }

    private addPreBackground(){
        const background = new Graphics();
        background.rect(0, 0, this._width, this._height);
        background.fill("black");
        this.addChild(background);
    }

    async loadGameAssets(assets: Array<AssetInfo>) {
        this.loadingBar.x = this._width / 2 - this.loadingBar.width / 2;
        await this.load(assets, (progress) => {
            setTimeout(() => {
                this.loadingBar.updateFill(progress)
            }, 1000)
        });
    }

    async load(assets: Array<AssetInfo>, onProgress: (progress: number) => void) {
        let loadedCount = 0;

        // Function to handle asset loading with progress tracking
        const loadAsset = async (asset: AssetInfo) => {
            await Assets.load({
                alias: asset.src,
                src: asset.src,
                data: asset.data || {},
                ...(asset.src.includes(".atlas") && { loadParser: "loadTxt" }),
            });

            // Increment the count of loaded assets and update progress
            loadedCount++;
            const progress = loadedCount / assets.length;
            onProgress(progress);
        };

        // Load all assets with progress tracking
        await Promise.all(assets.map((asset) => loadAsset(asset)));
    }
}
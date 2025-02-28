import { Assets, Graphics } from "pixi.js";
import LoadingBar from "./loadingBar";
import { GameView } from "../GameView";
import { CustomSprite } from "../../components/customSprite";

export type AssetInfo = {
  src: string;
  data?: {
    scaleMode?: string;
    autoGenerateMipMaps?: boolean;
    resolution?: number;
  };
};

export class GameLoader {
  loadingBar!: LoadingBar;
  background!: Graphics;
  onAimLogo!: CustomSprite;

  constructor(public gameView: GameView) {}

  init() {
    this.addBackground();
    this.addOnAimLogo();
    this.addLoadingBar();
  }

  private addLoadingBar() {
    this.loadingBar = new LoadingBar(this.gameView);
    this.loadingBar.x = this.gameView.width / 2;
    this.loadingBar.y = this.gameView.height / 2;
    this.gameView.add(this.loadingBar);
  }

  private addBackground() {
    console.log(this.gameView.width, this.gameView.height);
    this.background = new Graphics();
    this.background.rect(0, 0, this.gameView.width, this.gameView.height);
    this.background.fill("black");
    this.gameView.add(this.background);
  }

  private addOnAimLogo() {
    this.onAimLogo = new CustomSprite(
      "onAimLogo",
      this.gameView.width / 2,
      this.gameView.height / 2 - 100
    );
    this.gameView.add(this.onAimLogo);
  }

  async loadGameAssets(assets: Array<AssetInfo>): Promise<void> {
    await this.load(assets, (progress) => {
      this.loadingBar.updateFill(progress);
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

import {Application} from "pixi.js";
import {initDevtools} from "@pixi/devtools";
import {GameLoader} from "./loader";
import {gameAssets} from "../config/loadData.ts";

export class GameView extends Application {
    private gameLoader!: GameLoader;
    private readonly width!: number;
    private readonly height!: number;

    constructor(public gameElement: HTMLElement) {
        super();

        this.width = this.gameElement.offsetWidth;
        this.height = this.gameElement.offsetHeight;


        this.setup(true).then(async () => {
            this.gameLoader = new GameLoader(this.width, this.height);

            this.stage.addChild(this.gameLoader);

            await this.gameLoader.loadGameAssets(gameAssets);

        });
    }


    public hideLoadingScene() {
        this.gameLoader.loadingBar.destroy();
    }

    private async setup(devTools: boolean) {
        await this.init({
            background: "#FFF",
            backgroundAlpha: 0,
            resizeTo: this.gameElement,
            antialias: true,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
        });

        devTools && await initDevtools(this);
        this.gameElement!.appendChild(this.canvas);
    }
}


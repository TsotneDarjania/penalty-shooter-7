import {Assets, Container, Graphics} from "pixi.js";
import gsap from "gsap";
import {CustomSprite} from "../../../components/customSprite.ts";
import {CustomText} from "../../../components/customText.ts";
import {calculatePercentage} from "../../../../utils/scale";


export default class LoadingBar extends Container {
    fillWidth!: number;
    fillHeight!: number;

    background!: Graphics;
    fill!: Graphics;
    loadingBarContainer: Container = new Container();

    onAimLogo!: CustomSprite;

    text!: CustomText;

    constructor(public _width: number, public _height: number) {
        super();
        this.fillWidth = calculatePercentage(70, this._width);
        this.fillHeight = 10;


        this.init();
        this.y = this._height / 2;
    }

    async preload() {
        await Assets.load({
            alias: "onAimLogo",
            src: "../assets/images/onaim-logo.png",
            data: {
                scaleMode: "linear",
                autoGenerateMipMaps: true,
            },
        });
    }

    private init() {
        this.preload().then(async () => {
            this.addBackground();
            this.addOnAimLogo();
            this.animateLogo();
            this.addFill();

            this.addChild(this.loadingBarContainer);
        });
    }

    private addOnAimLogo() {
        this.onAimLogo = new CustomSprite(
            "onAimLogo",
            0,
            -this._height * 0.1
        );
        this.addChild(this.onAimLogo);
    }

    private addBackground() {
        this.background = new Graphics();
        this.background.roundRect(0, 0, this.fillWidth, this.fillHeight);
        this.background.fill(0x12a653);

        this.background.x -= this.background.width / 2;
        this.loadingBarContainer.addChild(this.background);
    }

    addFill() {
        this.fill = new Graphics();
        this.fill.roundRect(0, 0, 0, this.fillHeight);
        this.fill.fill(0x06ed6e);
        this.fill.x = this.background.x;
        this.loadingBarContainer.addChild(this.fill);
    }

    updateFill(progress: number) {
        progress = Math.max(0, Math.min(1, progress));
        this.fill.roundRect(0, 0, this.fillWidth * progress, this.fillHeight);
        this.fill.fill(0x06ed6e);
    }

    private animateLogo(): void {
        gsap.to(this.onAimLogo, {
            alpha: 0.5,
            duration: 0.5,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut",
        });
    }
}
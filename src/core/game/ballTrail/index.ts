import { Particle, ParticleContainer, Texture } from "pixi.js";

import gsap from "gsap";
import { GameView } from "../GameView";

export class BallTrail {
  particleContainer!: ParticleContainer;

  constructor(public gameView: GameView) {
    this.init();
  }

  drawParticles(x: number, y: number) {
    const texture = Texture.from(GameAssets.images.mouseRopeEffect);
    let particle = new Particle({
      texture,
      x,
      y,
      scaleX: 0.39,
      scaleY: 0.39,
      rotation: Math.PI / 2,
      anchorX: 0.5,
      anchorY: 0.5,
    });
    gsap.to(particle, {
      duration: 0.7,
      alpha: 0,
      onComplete: () => {
        this.particleContainer.removeParticle(particle);
      },
    });
    this.particleContainer.addParticle(particle);
  }

  init() {
    this.particleContainer = new ParticleContainer({
      dynamicProperties: {
        scale: true,
        position: true,
        rotation: true,
        uvs: false,
        tint: true,
      },
    });
    this.gameView.add(this.particleContainer);
    this.gameView.ticker.add(() => {
      this.particleContainer.update();
    });
  }
}

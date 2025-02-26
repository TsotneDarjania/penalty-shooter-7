import { Sprite, Texture } from "pixi.js";

export class CustomSprite extends Sprite {
  constructor(
    public textureAlias: string,
    public xPos: number,
    public yPos: number
  ) {
    super(Texture.from(textureAlias));
    this.x = xPos;
    this.y = yPos;

    this.anchor = 0.5;
  }
}

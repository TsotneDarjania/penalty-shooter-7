import { Text } from "pixi.js";

export class CustomText extends Text {
  constructor(
    public innerText: string,
    public xPos: number,
    public yPos: number,
    public styleData?: {
      fontFamily?: string;
      fontSize?: string;
      color?: string;
      maxWidth?: number;
      anchor?: number;
      align?: "left" | "center" | "right" | "justify";
    }
  ) {
    super({ text: innerText });
    this.x = xPos;
    this.y = yPos;

    if (styleData) {
      this.anchor = styleData.anchor ? styleData.anchor : 0.5;
      this.style.fontFamily = styleData.fontFamily ? styleData.fontFamily : "";
      this.style.fontSize = styleData.fontSize ? styleData.fontSize : "20";
      this.style.fill = styleData.color ? styleData.color : "black";
      this.style.align = styleData.align ? styleData.align : "left";
      (this.style.wordWrap = true),
        (this.style.wordWrapWidth = styleData.maxWidth
          ? styleData.maxWidth
          : 99999);
    }
  }
}

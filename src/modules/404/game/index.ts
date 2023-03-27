/*
 * @Author: mulingyuer
 * @Date: 2023-03-22 04:02:50
 * @LastEditTime: 2023-03-22 05:09:45
 * @LastEditors: mulingyuer
 * @Description: game
 * @FilePath: \Typecho_Theme_JJ\src\modules\404\game\index.ts
 * 怎么可能会有bug！！！
 */
import "./style.scss";

/** 监听按键触发游戏 */
class Game {
  /** 游戏开始提示 */
  private errorCard: HTMLElement | null = document.querySelector(".error-card");

  constructor() {
    document.addEventListener("keydown", this.onKeyDown);
    document.addEventListener("touchstart", this.onTouchStart);
  }

  /** 按键事件 */
  private onKeyDown = (event: KeyboardEvent) => {
    event = event || window.event;
    if (event.key.toLocaleLowerCase().trim() === "") {
      this.hiddenBox();
    }
  };

  /** 移动端点击 */
  private onTouchStart = (event: TouchEvent) => {
    this.hiddenBox();
  };

  /** 隐藏开始信息 */
  private hiddenBox() {
    if (this.errorCard) {
      this.errorCard.style.display = "none";
    }
  }
}

new Game();

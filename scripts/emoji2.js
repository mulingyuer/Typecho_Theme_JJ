/*
 * @Author: mulingyuer
 * @Date: 2024-04-20 19:27:26
 * @LastEditTime: 2024-04-20 19:46:11
 * @LastEditors: mulingyuer
 * @Description: 获取b站表情颜文
 * @FilePath: /Typecho_Theme_JJ/scripts/emoji2.js
 * 怎么可能会有bug！！！
 */

(async function () {
  const emojiContent = document.querySelector(".emoji-content");
  if (!emojiContent) return;

  const data = [];

  emojiContent.children.forEach((item) => {
    const textDom = item.querySelector(".text-emoji");
    const text = textDom.innerText;

    data.push({
      key: text,
      val: text,
      hidden: false,
    });
  });

  console.log(data);
})();
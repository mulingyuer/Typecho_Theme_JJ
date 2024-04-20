/*
 * @Author: mulingyuer
 * @Date: 2024-04-20 19:27:01
 * @LastEditTime: 2024-04-20 22:32:59
 * @LastEditors: mulingyuer
 * @Description: 获取b站表情脚本
 * @FilePath: /Typecho_Theme_JJ/scripts/emoji1.js
 * 怎么可能会有bug！！！
 */

(async function () {
  function sleep() {
    return new Promise((resolve) => setTimeout(resolve, 5000));
  }

  const emojiContent = document.querySelector(".emoji-content");
  const textarea = document.querySelector(".reply-box-textarea");
  if (!emojiContent || !textarea) return;

  const data = [];
  const downloadList = [];
  const emojiDomList = [...emojiContent.children].reverse();

  emojiDomList.forEach((item) => item.click());

  await sleep();

  const textareaValue = textarea.value.split("][").map((text) => {
    text = text.replace(/^\[/, "");
    text = text.replace(/\]$/, "");
    return text;
  }).reverse();

  emojiDomList.forEach((item) => {
    const img = item.querySelector("img");
    const src = img.getAttribute("src").split("@")[0];
    const key = textareaValue.shift();

    data.push({
      key,
      src: `/static/images/emoji/yellow_face/${src.split("/").pop()}`,
      hidden: false,
    });
    downloadList.push(src);
  });

  console.log(data.reverse());
  console.log(downloadList.map((text) => `https:${text}`).join("\n"));
})();
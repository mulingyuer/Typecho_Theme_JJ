/*
 * @Author: mulingyuer
 * @Date: 2024-04-17 17:11:01
 * @LastEditTime: 2024-04-17 17:36:11
 * @LastEditors: mulingyuer
 * @Description: 主题配置
 * @FilePath: \Typecho_Theme_JJ\.vitepress\theme\index.mts
 * 怎么可能会有bug！！！
 */
import DefaultTheme from "vitepress/theme";
import { onMounted, onUnmounted, watch, nextTick } from "vue";
import { useRoute } from "vitepress";
import mediumZoom from "medium-zoom";
import type { Zoom } from "medium-zoom";

import "./medium-zoom.css";

/** @type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,
  setup() {
    const route = useRoute();
    let mediumZoomInstance: Zoom | null = null;

    /** 初始化灯箱 */
    function initZoom() {
      destroyZoom();
      mediumZoomInstance = mediumZoom(".main img", {
        background: "rgba(0,0,0,0.25)",
      });
    }

    /** 销毁灯箱 */
    function destroyZoom() {
      if (mediumZoomInstance) {
        mediumZoomInstance.detach();
        mediumZoomInstance = null;
      }
    }

    onMounted(() => {
      initZoom();
    });

    onUnmounted(() => {
      destroyZoom();
    });

    watch(
      () => route.path,
      () => nextTick(() => initZoom())
    );
  },
};

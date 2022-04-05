/*
 * @Author: mulingyuer
 * @Date: 2022-04-05 00:26:46
 * @LastEditTime: 2022-04-05 16:58:39
 * @LastEditors: mulingyuer
 * @Description: Effect 副作用函数
 * @FilePath: \Typecho_Theme_JJ\packages\reactivity\effect.ts
 * 怎么可能会有bug！！！
 */
import { isArray, isIntegerKey } from "@packages/shared";

/**
 * @description: 副作用函数
 * @param {*} fn 用户的函数
 * @param {any} options 配置
 * @Date: 2022-04-05 00:29:02
 * @Author: mulingyuer
 */
export function effect(fn: Function, options: any = {}) {
  const effect = creatReactiveEffect(fn, options);

  //是否懒作用
  if (!options.lazy) {
    effect();
  }

  return effect;
}

const effectStack: any[] = []; //副作用函数队列，用于记录当前执行的副作用函数（存在嵌套effect情况）
let activeEffect: Function | void; //当前触发的副作用函数
/**
 * @description: 创建能被响应式对象依赖收集的副作用函数
 * @param {*} fn
 * @param {*} options
 * @Date: 2022-04-05 00:29:39
 * @Author: mulingyuer
 */
function creatReactiveEffect(fn: Function, options: object) {
  const effect = function () {
    try {
      effectStack.push(effect);
      activeEffect = effect;

      return fn();
    } finally {
      effectStack.pop(); //结束之后从队列中删除我自己
      activeEffect = effectStack[effectStack.length - 1]; //
    }
  };

  effect.__isEffect = true; //是否effect
  effect.options = options;
  effect.deps = [] as any[]; //effect用来收集依赖了那些属性

  return effect;
}

// 所有依赖收集都会存储到这么一个结构里面
// WeakMap {
//   target: Map {
//     key: Set [effect,effect]
//   }
// }
const targetMap = new WeakMap();
/**
 * @description: 依赖收集器
 * @param {*} target 目标对象
 * @param {*} type 依赖类型
 * @param {*} key 依赖键
 * @Date: 2022-04-05 00:46:56
 * @Author: mulingyuer
 */
export function track(target: object, type: string, key: string) {
  if (typeof activeEffect === "undefined") {
    return; //不存在副作用函数，直接返回（所有的依赖收集都必须在effect中才行）
  }

  //目标对象的map
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map())); //不存在就创建一个target的map
  }
  //目标对象的依赖键的set
  let dep: Set<Function> = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, (dep = new Set())); //不存在就创建一个key的set
  }
  //收集依赖：如果activeEffect不存在就收集它
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect);
  }
}

/**
 * @description: 发布消息
 * @param {*} target 目标对象
 * @param {*} type 依赖类型
 * @param {*} key 依赖键
 * @param {*} newVal 新的值
 * @param {*} oldVal 旧的值
 * @Date: 2022-04-05 00:55:11
 * @Author: mulingyuer
 */
export function trigger(target: object, type: string, key: string, newVal: any, oldVal?: any) {
  //去依赖收集器里查找对应的target的key的Set是否存在
  const depsMap = targetMap.get(target);
  //不存在说明依赖没有收集（effect中才能收集），可能就是普通赋值，直接返回
  if (!depsMap) {
    return;
  }
  //存储所有的effect
  const effectsSet = new Set();
  //统一传effectsSet中的方法
  const add = function (effects: Set<Function>) {
    if (!effects) return;
    effects.forEach((effect) => {
      effectsSet.add(effect);
    });
  };

  //数组length修改会导致部分effect无法更新：length为3，用户监听的是下标2，length改为1时，不会触发下标2的effect
  if (isArray(target) && key === "length") {
    //遍历数组数组所有的Set，如果key大于length就手动插入到effectsSet
    depsMap.forEach((depSet: Set<Function>, key: string) => {
      if (key > newVal || key === "length") {
        add(depSet); //添加到effectsSet
      }
    });
  } else {
    //查找对应的key的Set是否存在
    add(depsMap.get(key)); //收集key的依赖
    //数组在effect中被JSON.stringify转换，则会收集所有的依赖，包括length，
    //但是在get收集时以免触发两次把length屏蔽了，所以这里要手动触发已收集的length
    switch (type) {
      case "add":
        if (isArray(target) && isIntegerKey(key)) {
          add(depsMap.get("length"));
        }
    }
  }

  //发布消息
  effectsSet.forEach((effect: any) => effect());
}

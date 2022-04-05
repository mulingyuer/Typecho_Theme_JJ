/*
 * @Author: mulingyuer
 * @Date: 2022-04-04 02:26:11
 * @LastEditTime: 2022-04-05 04:06:24
 * @LastEditors: mulingyuer
 * @Description: proxy代理handler
 * @FilePath: \vue3-receiver\packages\reactivity\src\baseHandlers.ts
 * 怎么可能会有bug！！！
 */
import { extend, isObject, isArray, isIntegerKey, hasChanged, hasOwn } from "@packages/shared";
import { reactive, readOnly } from "./reactive";
import { track, trigger } from "./effect";

/**
 * @description: 根据配置创建getter拦截器
 * @param {boolean} isReadOnly 是否只读
 * @param {boolean} isShallow 是否浅拷贝
 * @Date: 2022-04-04 02:44:05
 * @Author: mulingyuer
 */
function createGetter(isReadOnly = false, isShallow = false) {
  return function (target: object, key: string, receiver: object) {
    const res = Reflect.get(target, key, receiver);

    //依赖收集：只读属性不需要响应式
    if (!isReadOnly) {
      track(target, "get", key);
    }

    //浅响应式：直接返回值
    if (isShallow) {
      return res;
    }

    //深响应式：返回代理对象
    //懒递归，使用时才创建代理对象
    if (isObject(res)) {
      return isReadOnly ? readOnly(res) : reactive(res);
    }
    return res;
  };
}

const mutableGetter = createGetter(); //可变对象的getter
const shallowReactiveGetter = createGetter(false, true); //浅拷贝可变对象的getter
const readonlyGetter = createGetter(true); //只读对象的getter
const shallowReadonlGetter = createGetter(true, true); //浅拷贝只读对象的getter

/**
 * @description: 根据配置创建setter拦截器
 * @param {boolean} isShallow 是否浅拷贝
 * @Date: 2022-04-04 02:49:10
 * @Author: mulingyuer
 */
function createSetter(isShallow = false) {
  return function (target: any, key: string, val: any, receiver: object) {
    //旧值：用于判断是否修改
    const oldVal = target[key];

    //判断是修改还是新增：数组push会触发两次set，一次是push数据，一次是更新length，需要避免这个问题
    //未修改之前的数组length是否大于当前的key，大于说明key是数组已有的
    const isEdit = isArray(target) && isIntegerKey(key) ? target.length > Number(key) : hasOwn(target, key);

    //set
    const res = Reflect.set(target, key, val, receiver);

    //依赖更新
    if (!isEdit) {
      trigger(target, "add", key, val, oldVal);
    } else if (hasChanged(oldVal, val)) {
      trigger(target, "edit", key, val, oldVal);
    }

    return res;
  };
}

const mutableSetter = createSetter(); //可变对象的setter
const shallowReactiveSetter = createGetter(true); //浅拷贝可变对象的setter

export const mutableHandlers = {
  get: mutableGetter,
  set: mutableSetter,
};

export const shallowReactiveHandlers = {
  get: shallowReactiveGetter,
  set: shallowReactiveSetter,
};

const shallowSetter = {
  set: function (target: object, key: string) {
    console.warn(`只读对象不允许赋值属性：${key}！`);
  },
};

export const readonlyHandlers = extend(
  {
    get: readonlyGetter,
  },
  shallowSetter
);

export const shallowReadonlyHandlers = extend(
  {
    get: shallowReadonlGetter,
  },
  shallowSetter
);

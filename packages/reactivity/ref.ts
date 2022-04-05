/*
 * @Author: mulingyuer
 * @Date: 2022-04-05 03:18:06
 * @LastEditTime: 2022-04-05 16:58:51
 * @LastEditors: mulingyuer
 * @Description:ref
 * @FilePath: \Typecho_Theme_JJ\packages\reactivity\ref.ts
 * 怎么可能会有bug！！！
 */
import { isObject, hasChanged, isArray } from "@packages/shared";
import { reactive } from "./reactive";
import { track, trigger } from "./effect";

/**
 * @description: ref
 * @param {*} value
 * @Date: 2022-04-05 03:18:48
 * @Author: mulingyuer
 */
export function ref(value: any) {
  return createRef(value);
}

/**
 * @description: 浅ref
 * @param {*} value
 * @Date: 2022-04-05 03:19:54
 * @Author: mulingyuer
 */
export function shallowRef(value: any) {
  return createRef(value, true);
}

const convert = (val: any) => (isObject(val) ? reactive(val) : val);
export class RefImpl {
  private _value: any;
  public readonly __v_isRef = true; //是否为ref对象

  constructor(public rawVal: any, public readonly isShallow: boolean) {
    this._value = isShallow ? rawVal : convert(rawVal); //浅ref直接返回原值
  }

  public get value() {
    //依赖收集
    track(this, "get", "value");
    return this._value;
  }

  public set value(newVal) {
    const oldVal = this.rawVal;
    //值改变了
    if (hasChanged(newVal, oldVal)) {
      this.rawVal = newVal; //用于下次对比
      this._value = this.isShallow ? newVal : convert(newVal);
      //发布消息
      trigger(this, "set", "value", newVal, oldVal);
    }
  }
}

/**
 * @description: 创建ref对象
 * @param {*} value
 * @param {*} isShallow
 * @Date: 2022-04-05 03:19:19
 * @Author: mulingyuer
 */
function createRef(value: any, isShallow = false) {
  return new RefImpl(value, isShallow);
}

/**
 * @description: 是否为ref对象
 * @param {any} val
 * @Date: 2022-04-05 04:55:20
 * @Author: mulingyuer
 */
export function isRef(val: any) {
  return val && val.__v_isRef === true;
}

class ObjectRefImpl<T extends object, K extends keyof T> {
  public readonly __v_isRef = true; //是否为ref对象

  constructor(private readonly target: T, private readonly key: K) {}

  public get value() {
    return this.target[this.key];
  }

  public set value(newVal) {
    this.target[this.key] = newVal;
  }
}
/**
 * @description: 将对象指定的key转换为ref对象，但是本身不存在依赖收集，响应式取决于target自身是否有依赖收集
 * @param {any} target
 * @param {any} key
 * @Date: 2022-04-05 16:43:15
 * @Author: mulingyuer
 */
export function toRef<T extends object, K extends keyof T>(target: T, key: K) {
  return new ObjectRefImpl(target, key);
}

/**
 * @description: 批量将对象的属性转为ref对象，但是本身不存在依赖收集，响应式取决于target自身是否有依赖收集
 * @param {T} target
 * @Date: 2022-04-05 16:53:00
 * @Author: mulingyuer
 */
export function toRefs<T extends object>(target: T) {
  const refs = isArray(target) ? new Array(target.length) : {};

  for (let key in target) {
    // @ts-ignore
    refs[key] = toRef(target, key);
  }

  return refs;
}

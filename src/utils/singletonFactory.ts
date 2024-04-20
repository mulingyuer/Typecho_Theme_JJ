/*
 * @Author: mulingyuer
 * @Date: 2024-04-21 02:19:32
 * @LastEditTime: 2024-04-21 02:21:51
 * @LastEditors: mulingyuer
 * @Description: 单例工厂
 * @FilePath: /Typecho_Theme_JJ/src/utils/singletonFactory.ts
 * 怎么可能会有bug！！！
 */

/** 单例工厂 */
export class SingletonFactory {
	private static instances: Map<any, any> = new Map();

	public static getInstance<T>(clazz: { new (): T }): T {
		if (!SingletonFactory.instances.has(clazz)) {
			SingletonFactory.instances.set(clazz, new clazz());
		}
		return SingletonFactory.instances.get(clazz);
	}
}

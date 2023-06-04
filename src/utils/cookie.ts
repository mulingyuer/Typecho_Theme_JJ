/*
 * @Author: mulingyuer
 * @Date: 2023-06-04 21:28:34
 * @LastEditTime: 2023-06-04 21:32:09
 * @LastEditors: mulingyuer
 * @Description: cookie
 * @FilePath: \Typecho_Theme_JJ\src\utils\cookie.ts
 * 怎么可能会有bug！！！
 */
/** 配置 */
interface Options {
	/** key前缀 */
	prefix?: string;
}
/** 默认配置 */
const defaultOptions: Options = {
	prefix: ""
};

class CookieStorage {
	private prefix: string;

	constructor(options: Options = defaultOptions) {
		const { prefix } = options;
		this.prefix = prefix ?? "";
	}

	/**
	 * @description: 设置cookie
	 * @param {string} key 键
	 * @param {any} value 值
	 * @param {number} expires 过期时间s毫秒，不传默认2年有效
	 * @Date: 2023-05-17 18:10:34
	 * @Author: mulingyuer
	 */
	public setItem(key: string, value: string | number, expires?: number): void {
		const timestamp = Date.now();
		if (typeof expires === "number") {
			expires = timestamp + expires;
		} else {
			expires = timestamp + 2 * 365 * 24 * 60 * 60 * 1000;
		}
		document.cookie = `${this.prefix}${key}=${value};expires=${new Date(expires).toUTCString()}`;
	}

	/**
	 * @description: 获取cookie
	 * @param {string} key 键
	 * @Date: 2023-05-17 18:31:50
	 * @Author: mulingyuer
	 */
	public getItem(key: string): string | undefined {
		const cookies = document.cookie.split("; ");
		let val: string | undefined = undefined;
		cookies.find((item) => {
			const [k, v] = item.split("=");
			if (k === `${this.prefix}${key}`) {
				val = v;
				return true;
			}
			return false;
		});

		return val;
	}

	/**
	 * @description: 删除指定key的cookie
	 * @param {string} key 键
	 * @Date: 2023-05-17 18:32:56
	 * @Author: mulingyuer
	 */
	public removeItem(key: string): void {
		this.setItem(key, "", -1);
	}

	/**
	 * @description: 清空所有cookie
	 * @Date: 2023-05-17 23:13:04
	 * @Author: mulingyuer
	 */
	public clear(): void {
		const cookies = document.cookie.split("; ");
		cookies.forEach((item) => {
			const [k] = item.split("=");
			this.removeItem(k);
		});
	}
}

const cookieStorage = new CookieStorage({ prefix: "jj_" });

export default cookieStorage;
export { CookieStorage };

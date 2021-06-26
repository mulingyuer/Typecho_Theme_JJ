/*
 * @Author: mulingyuer
 * @Date: 2021-06-21 22:44:32
 * @LastEditTime: 2021-06-26 16:21:53
 * @LastEditors: mulingyuer
 * @Description: 搜索记录
 * @FilePath: \JJ\common\js\utils\search-record.js
 * 怎么可能会有bug！！！
 */

class SearchRecord {
  //默认配置
  defaultOptions = {
    key: "searchRecord", //key
    maxSize: 7,  //最大条数
    data: null, //搜索记录
  };

  constructor(options = {}) {
    this.init(options);  //初始化
  }

  //初始化
  init(options) {
    Object.assign(this, this.defaultOptions, options);  //合并配置
    this.read(); //读取记录
  }

  //添加一条新记录
  push(value) {
    if (value === "") return; //空值不处理
    if (typeof value === "string" || typeof value === "number") {
      //如果是重复的数据，先删除在add插入
      if (this.data.has(value)) {
        this.data.delete(value);
      }

      //条数限制
      if (this.data.size >= this.maxSize) {
        //最新maxSize-1条数据
        let newArr = [...this.data].slice(-(this.maxSize - 1));
        this.data = new Set(newArr);
      }
      this.data.add(value);
      this.save();
    } else {
      throw new Error("添加记录的值不正确，必须为string值或者number值");
    }
  }

  //删除一条记录
  remove(value) {
    if (this.data.has(value)) {
      this.data.delete(value);
      this.save();
    }
  }

  //全新数据
  setNewData(arr = []) {
    switch (this.utils.getType(arr)) {
      case "array":
        this.data = new Set(arr);
        this.save();
        break;
      case "set":
        this.data = new Set([...arr]);  //浅拷贝
        this.save();
        break;
      default:
        throw new Error("传入的数据必须为数组或者set");
    }
  }

  //获取搜索记录-倒叙
  getSearchData() {
    return [...this.data].reverse();
  }

  //记录条数
  get size() {
    return this.data.size;
  }

  //读取本地记录
  read() {
    const arr = localStorage.getItem(this.key);
    if (arr) {
      this.data = new Set(JSON.parse(arr));
    } else {
      this.data = new Set();
    }
  }

  //是否存在
  isValue(value) {
    if (typeof value === "string" || typeof value === "number") {
      return this.data.has(value);
    } else {
      throw new Error("判断的值必须为string值或者number值")
    }
  }

  //本地保存记录
  save() {
    localStorage.setItem(this.key, JSON.stringify([...this.data]));
  }

  //清理记录
  clear() {
    localStorage.removeItem(this.key);
    this.data = new Set();
  }

  //同步本地与data的数据
  update() {
    this.read();
  }


  //工具
  utils = {
    getType(value) {
      let type = typeof value;
      if (type !== "object") {
        return type;
      }
      return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
    }
  }
}

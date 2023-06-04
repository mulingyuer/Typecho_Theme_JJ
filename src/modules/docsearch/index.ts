/*
 * @Author: mulingyuer
 * @Date: 2023-06-04 16:19:55
 * @LastEditTime: 2023-06-04 23:02:30
 * @LastEditors: mulingyuer
 * @Description: docsearch
 * @FilePath: \Typecho_Theme_JJ\src\modules\docsearch\index.ts
 * 怎么可能会有bug！！！
 */
import docsearch from "@docsearch/js";
import "@docsearch/css";
import "./style.scss";
import cookieStorage from "@/utils/cookie";

/** cookie数据 */
interface CookieData {
	appid: string;
	apiKey: string;
	indexName: string;
	creationTime: number;
}
/** init Data */
type InitData = Omit<CookieData, "creationTime">;

class FixedDocSearch {
	/** 容器 */
	private container = document.querySelector(".docsearch-wrapper");
	constructor() {
		if (!this.container) return;
		const cookieStr = cookieStorage.getItem("docsearch");
		if (!cookieStr) return;

		try {
			const cookieData: CookieData = JSON.parse(decodeURIComponent(cookieStr));
			const { appid, apiKey, indexName } = cookieData;
			this.init({ appid, apiKey, indexName });
		} catch (error) {
			console.log(error);
		}
	}

	/** 初始化 */
	private init(data: InitData) {
		const { appid, apiKey, indexName } = data;
		//判空处理
		if (this.isEmptyStr(appid) || this.isEmptyStr(apiKey) || this.isEmptyStr(indexName)) return;
		//初始化
		docsearch({
			container: ".docsearch-wrapper",
			appId: appid,
			indexName: indexName,
			apiKey: apiKey,
			placeholder: "输入关键词搜索",
			maxResultsPerGroup: 15, //最大搜索结果数
			translations: {
				button: {
					buttonText: "搜索",
					buttonAriaLabel: "搜索"
				},
				modal: {
					searchBox: {
						resetButtonTitle: "清空搜索框中的搜索词",
						resetButtonAriaLabel: "清空搜索框中的搜索词",
						cancelButtonText: "取消",
						cancelButtonAriaLabel: "取消"
					},
					startScreen: {
						recentSearchesTitle: "最近",
						noRecentSearchesText: "暂无最近搜索记录",
						saveRecentSearchButtonTitle: "保存当前搜索",
						removeRecentSearchButtonTitle: "删除这条搜索记录",
						favoriteSearchesTitle: "收藏",
						removeFavoriteSearchButtonTitle: "删除这条收藏记录"
					},
					errorScreen: {
						titleText: "无法获取搜索结果",
						helpText: "您可能需要检查一下您的网络连接"
					},
					footer: {
						selectText: "查看",
						selectKeyAriaLabel: "回车",
						navigateText: "上下箭头选择",
						navigateUpKeyAriaLabel: "向上箭头",
						navigateDownKeyAriaLabel: "向下箭头",
						closeText: "关闭",
						closeKeyAriaLabel: "Esc键",
						searchByText: "搜索引擎"
					},
					noResultsScreen: {
						noResultsText: "没有搜索结果",
						suggestedQueryText: "尝试搜索",
						reportMissingResultsText: "您认为这个查询应该返回结果吗？",
						reportMissingResultsLinkText: "请告诉我们"
					}
				}
			}
		});
	}

	/** 判断是否是空字符串 */
	private isEmptyStr(str: string): boolean {
		return str.trim() === "";
	}
}

export default FixedDocSearch;

import langEn from './en.js';
import langzhHans from './zh-Hans.js';
import {initVueI18n} from '@dcloudio/uni-i18n';

// 所有语言包集合
const message =  {
	'en'  : langEn,
	'zh-Hans': langzhHans
}

/**
 * 获取当前语言（优先级：本地存储 > 系统语言 > 默认中文）
 */
export const getCurrentLocale = ()=>{
	return uni.getStorageSync("locale") || uni.getLocale() || "Hans";
}

// 单例模式：全局只初始化一次i18n实例
let i18nInstance = null;
const initI18n = ()=>{
	if(!i18nInstance) {
		i18nInstance = initVueI18n(message, getCurrentLocale());
	} 
	return i18nInstance;
}

/**
 * 翻译方法（仅用于纯字符串）
 * @param {string} key 翻译键名
 */
export const t = (key)=> initI18n().t(key);

/**
 * 原始值翻译方法（用于数组/对象）
 * @param {string} key 翻译键名
 */
//export const rt = (key) => initI18n().rt(key);
export const rt = t;

/**
 * 切换语言（全局生效）
 * @param {string} locale 语言代码（zh-Hans/en）
 */
export const setlocale = (locale) => {
	// 1. 本地存储用户选择
	uni.setStorageSync('locale', locale);
	
	// 2. 触发uni-app全局语言切换事件
	uni.setLocale(locale);
	
	// 3. 重新初始化i18n实例
	i18nInstance = initVueI18n(message, locale);
	
	//4、更新TabBar文字
	updateTabbarText();
}

/**
 * 更新TabBar文字（语言切换时自动调用）
 */
const updateTabbarText = () => {
	const tabarList = rt("tabbar").split(',');
	tabarList.forEach((item, index)=> {
		uni.setTabBarItem({
			index,
			text: item
		});
	})
}

export const currentI18nInstance = i18nInstance;
import { useUserStore } from '@/store/user/user.js';

//全局配置
const BASE_CONFIG = {
	baseUrl: import.meta.env.VITE_API_BASE_URL,
	timeout: 15000,
	header: {
		'Content-Type': 'application/json;charset=utf-8'
	}
}

// 正在进行的请求Map（用于取消重复请求）
const pendingRequests  = new Map();
// 请求计数器（用于控制Loading显示隐藏）
let loadingCount = 0

/**
 * 生成请求唯一标识
 * @param {Object} config 请求配置
 * @returns {String} 请求标识
 */
const generateRequestKey = (config) => {
	const { method, url, params, data } = config;
	return [
		method?.toUpperCase() || 'GET',
		url,
		JSON.stringify(params),
		JSON.stringify(data)
	].join("&")
}

/**
 * 显示全局Loading
 */
const showLoading = () => {
	loadingCount++;
	uni.showLoading({
		title: '加载中...',
		mask: false
	})
}

/**
 * 隐藏全局Loading
 */
const hideLoading = () => {
	loadingCount--;
	if(loadingCount <= 0) {
		uni.hideLoading();
		loadingCount = 0;
	}
}

/**
 * 取消所有pending请求（页面卸载时调用）
 */
const cancelAllPendingRequests  = () => {
	pendingRequests.forEach((controller) => {
		controller.abort("Request canceled by user");
	})
	pendingRequests.clear();
	loadingCount = 0;
	hideLoading();
}

/**
 * 请求重试机制
 * @param {Object} config 请求配置
 * @param {Number} retryCount 重试次数
 * @param {Number} retryDelay 重试间隔(ms)
 * @returns {Promise}
 */
export const retryRequest = async (config, retryCount=3, retryDelay=1000) => {
	// 初始化重试计数器
	if(!config.__retryCount){
		config.__retryCount = 0
	}

	if(config.__retryCount > retryCount) {
		return Promise.reject(new Error('请求失败，已达到最大重试次数'));
	}
	config.__retryCount++;
	
	 // 延迟重试
	 await new Promise((resolve) => setTimeout(resolve, retryDelay));
	 
	 return request(config);
}

/**
 * 统一请求方法
 * @param {Object} config 请求配置
 * @returns {Promise}
 */
const request = (config) => {
	return new Promise(function(resolve, reject){
		 // 合并配置
		 const finalConfig = {
			 ...BASE_CONFIG,
			 ...config,
			 url:config.baseUrl?config.url:BASE_CONFIG.baseUrl+config.url
		 }
		 
		// 生成请求唯一标识
		const requestKey = generateRequestKey(finalConfig);
		// 取消重复请求
		if(pendingRequests.has(requestKey)) {
			const pendingController =  pendingRequests.get(requestKey);
			pendingController.abort()
		}
		
		// 显示Loading（可通过config.hideLoading = true关闭单个请求的loading）
		if(!finalConfig.hideLoading) {
			showLoading();
		}
		
		// 自动添加Token
		const userStore = useUserStore();
		if(userStore.token) {
			finalConfig.header = {
				...finalConfig.header,
				'Authorization': `Bearer ${userStore.token}`
			}
		}
		
		// 发起请求
		uni.request({
			...finalConfig,
			success:(res)=>{
				pendingRequests.delete(requestKey);
				hideLoading();
				
				const data = res.data;
				// 根据后端约定的状态码处理
				// 假设后端返回格式：{ code: 200, data: {}, message: 'success' }
				if(data.code === 200) {
					resolve(data);
				} else if(data.code ===401) {
					// Token过期或未登录
					uni.showModal({
						title: '错误提示',
						content: '登录状态已过期，请重新登录',
						showCancel:false,
						success:() => {
							userStore.logout();
							uni.reLaunch({ url: '/pages/login/login' })
						}
					})
					reject(new Error(data.message || '登录已过期'))
				} else {
					// 其他业务错误
					uni.showToast({
					title: data.message || '请求失败',
					icon: 'none',
					duration: 2000
				  })
				  reject(new Error(data.message || '请求失败'))
				}
			},
			fail:async (err)=>{
				// 从pending队列移除
				pendingRequests.delete(requestKey);
				hideLoading();
				
				// 如果是主动取消的请求，不显示错误也不重试
				if(err.errMsg.includes('abort')) {
					reject(err);
					return;
				}
				
				if(err.errMsg.includes('Network Error') ||
					err.errMsg.includes('timeout') ||
					err.errMsg.includes('fail')) {
					try {
						const result  = await retryRequest(config);
						resolve(result);
					} catch(retryErr) {
						// 重试失败后显示最终错误
						let message = '网络连接失败，请检查网络'
						if (err.errMsg.includes('timeout')) {
							message = '请求超时，请稍后再试'
						}
						uni.showToast({
							title: message,
							icon: 'none',
							duration: 2000
						})
						reject(retryErr)
					}
				}
			}
		})
	})
}
	
export	const http = {
		/**
		 * GET请求
		 * @param {String} url 请求地址
		 * @param {Object} params 请求参数
		 * @param {Object} config 额外配置
		 * @returns {Promise}
		 */
		get(url, params={}, config={}){
			return request({
				url, 
				params,
				...config
			})
		},
		
		/**
		   * POST请求（JSON格式）
		   * @param {String} url 请求地址
		   * @param {Object} data 请求数据
		   * @param {Object} config 额外配置
		   * @returns {Promise}
		   */
		post(url, data={}, config={}){
			return request({
				url, 
				method:'POST',
				data,
				...config
			})
		},
		
		/**
		   * POST请求（FormData格式，用于表单提交）
		   * @param {String} url 请求地址
		   * @param {Object} data 请求数据
		   * @param {Object} config 额外配置
		   * @returns {Promise}
		   */
		postForm(url, data={}, config={}){
			return request({
				method: 'POST',
				url,
				header:{
					'Content-Type':'application/x-www-form-urlencoded'
				},
				data,
				...config
				
			})
		},
		
		/**
		   * PUT请求
		   * @param {String} url 请求地址
		   * @param {Object} data 请求数据
		   * @param {Object} config 额外配置
		   * @returns {Promise}
		   */
		put(url, data={}, config={}){
			return request({
				method:'PUT',
				url, 
				data,
				...config
			})
		},
		
		/**
		   * DELETE请求
		   * @param {String} url 请求地址
		   * @param {Object} params 请求参数
		   * @param {Object} config 额外配置
		   * @returns {Promise}
		   */
		delete(url, params={}, config={}){
			return request({
				method:'DELETE',
				url, 
				params,
				...config
			})
		},
		
		/**
		   * 文件上传
		   * @param {String} url 上传地址
		   * @param {String} filePath 文件路径
		   * @param {String} fileName 文件字段名
		   * @param {Object} formData 额外表单数据
		   * @param {Object} config 额外配置
		   * @returns {Promise}
		   */
		uploadFile(url, filePath, fileName, formData, config={}) {
			return new Promise((resolve, reject)=>{
				const auth = useUserStore();
				if(!config.hideLoading) {
					showLoading();
				}
				
				uni.uploadFile({
					url:BASE_CONFIG.baseUrl+url,
					filePath,
					fileName,
					formData,
					header: {
						'Authorization': auth.token?`Bearer ${auth.token}`:'',
						...config.header
					},
					timeout: BASE_CONFIG.timeout,
					...config,
					success: (res)=>{
						hideLoading()
						try{
							const data = JSON.parse(res.data);
							if(data.code === 200) {
								resolve(data);
							} else {
								uni.showToast({
									title: data.message || '上传失败',
									icon: 'none'
								})
								reject(new Error(data.message || '上传失败'))
							}
						} catch(err) {
							uni.showToast({
							  title: '服务器返回格式错误',
							  icon: 'none'
							})
							reject(err);
						}
					},
					fail: (err)=>{
						hideLoading();
						uni.showToast({
							title: err.errMsg || '上传失败',
							icon: 'none'
						})
						reject(err);
					}
				})
			})
		},
		
		 /**
		   * 文件下载
		   * @param {String} url 下载地址
		   * @param {Object} config 额外配置
		   * @returns {Promise} 返回文件临时路径
		   */
		downloadFile(url, config) {
			return new Promise((resolve, reject)=>{
				const auth = useUserStore();
				if(!config.hideLoading) {
					showLoading();
				}
				
				uni.downloadFile({
					url, 
					header:{
						'Authorization':auth.token?`Bearer ${auth.token}`:'',
						...config.header
					},
					timeout:BASE_CONFIG.timeout,
					...config,
					success:(res)=>{
						hideLoading();
						try {
							if(res.statusCode === 200) {
								resolve(res.tempFilePath)
							} else {
								uni.showToast({
									title: `下载失败，状态码：${res.statusCode}`,
									icon: 'none'
								})
								reject(new Error(`下载失败，状态码：${res.statusCode}`))
							}
						} catch(err) {
							uni.showToast({
								title: err.errMsg + '下载失败',
								icon: 'none'
							 })
							 reject(new Error(err.errMsg + '下载失败'))
						}
					}
				})
			})
		}
}
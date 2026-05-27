import { defineStore } from "pinia";

export const useUserStore = defineStore('user', {
	state: () => ({
		userName: '',
		token:'', 
		isLogin: false,
		loading: false,
		errorMsg: ''
	}),
	
	getters: {
		getUserName: (state)=> state.userName,
		getIsLogin: (state) => state.isLogin,
		getToken: (state) => state.token
	},
	
	actions: {
		setToken(newToken) {
			this.token = newToken;
		},
		setIsLogin(newIsLogin) {
			this.isLogin = newIsLogin;
		},
		setUserName(newUserName) {
			this.userName = newUserName;
		},
		// 统一登录方法
		async login(userName, password) {
			this.loading = true;
			this.errorMsg = "";
			try {
				const res = await uni.request({
					url: import.meta.env.VITE_LOGIN_URL,
					method:"POST",
					data:{userName, password}
				})
				if(res.statusCode===200 && res.data?.code===0) {
					const {token, userName} = res.data.data;
					this.token = token;
					this.userName = userName;
					this.isLogin = true;
					return true;
				} else {
					this.error = '登录失败，具体原因:' + (res.data?.message || '');
					return false;
				}
			} catch (error) {
				this.errorMsg = '网络错误，请稍后重试'
				return false;
			} finally {
				this.loading = false;
			}
		},
		// 统一登出方法
		logout(){
			// 可选：调用后端登出接口
			// await uni.request({
			//   url: '/api/auth/logout',
			//   method: 'POST'
			// })
			this.$reset();
			uni.reLaunch({
				url:'/api/auth/login'
			})
		}
	}, 
	//持久化
	persist:{
		paths: ['userName', 'token', 'isLogin']
	}	
})
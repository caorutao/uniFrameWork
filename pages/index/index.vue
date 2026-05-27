<template>
	<view class="content">
		<uni-card :is-full="false" is-shadow title="card组件" sub-title="组件测试">
			<view class="cardContent">
					<image class="logo" src="/static/logo.png"></image>
					<text class="uni-text-small">{{title}}</text>
					<text class="uni-text-small">{{userName}}</text>
					<button class="uni-common-mt bottom_small" type="primary" size="mini" @tap="changeLang">切换语言</button>
					<button class="uni-common-mt bottom_small" type="primary" size="mini" @tap="changeTitle">更改title</button>
					<button class="uni-common-mt bottom_small" type="primary" size="mini" @tap="mockLogin">模拟登录</button>
					<button class="uni-common-mt bottom_large" type="primary" size="mini" @tap="retry">retryRequest</button>
			</view>
		</uni-card>
		
	</view>
</template>

<script setup>
	import { computed, onActivated, onDeactivated, onMounted, onUnmounted, onUpdated } from 'vue';
	import { t, rt, getCurrentLocale, setlocale } from '@/common/i18n/i18n.js';
	import { useUserStore } from '@/store/user/user.js';
	import { onReady, onShow } from '@dcloudio/uni-app';
	import { requestMock } from '@/mock/API.js'
	import { retryRequest } from '@/common/util/request.js'
	
	const title = computed(() => rt("tabbar"));
		
	const changeLang = () =>{
		const locale = getCurrentLocale();
		if(locale == "en") {
			setlocale("zh-Hans");
		} else {
			setlocale("en");
		}
	}
	
	const userStore = useUserStore();
	//userStore.setUserName('这是认为设置的UserName的值')
	const userName = computed(()=>userStore.userName)
	
	const changeTitle = ()=>{
		userStore.setUserName("这是修改后的title值");
	}
	
	const mockLogin = async () => {
		const url = import.meta.env.VITE_LOGIN_URL;
		const res = await requestMock(url, {userName:'admin', pwd:'123456'});
		console.log('requestMock返回值', JSON.stringify(res));
	}
	
	const retry = async () => {
		console.log('retry执行了');
		let config = {};
		config.__retryCount = 4;
		config.url = ''
		await retryRequest(config).then((res)=>{
			console.log(res);
		}).catch((err)=>{
			console.log('错误:',err.message);
		});
		
	}
	
	let timer = null;
	onMounted(()=>{
		console.log("onMounted执行了，此时所有组件已经加载完毕");
		timer = setTimeout(()=>{ 
			userStore.setUserName("onMounted执行完毕,所有页面已经渲染完毕后的title值");
		}, 3000)
	})
	
	onUnmounted(()=>{
		console.log("onUnmounted执行了，清除定时器");
		clearTimeout(timer);
		timer = null;
	})
	
	onActivated(async () => {
		console.log("onActivated执行了");
		await new Promise((resolve)=>setTimeout(resolve, 3000));
		userStore.setUserName('返回本页面的userName值');
	})
	
	onDeactivated(() => {
		console.log("onDeactivated执行了");
	})
	
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	
	.cardContent {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.logo {
		height: 100rpx;
		width: 100rpx;
		margin-top: 20rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 20rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}
	
	.bottom_small {
		margin-bottom: 0px;
	}
	.bottom_large {
		margin-bottom: 200px;
	}

</style>

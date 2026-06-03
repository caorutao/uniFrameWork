<template>
	<view class="content bg-white">
		<navbar is-hover :is-active="true" :badge="badgeText" v-model="userName" @login="login">
		</navbar>
		<view class='flex-row-between segment-Head mt-base'>
			<text class="text-gray-700 ml-lg text-sm">我的订单</text>
			<navigator url="/pages/api/index" :hover-stay-time="50">
				<text class="mr-xs text-sm text-blue mr-lg">全部订单></text>
			</navigator>
		</view>
		<view class="mt-base mx-lg flex flex-row items-center justify-around pb-base border-bt">
			<mine-list :mine-list="mineOrder"></mine-list>
		</view>
		<view class='flex-row-between segment-Head mt-base'>
			<text class="text-gray-700 ml-lg text-sm">我的权益</text>
		</view>
		<view class="mt-base mx-lg flex flex-row items-center justify-around pb-base border-bt">
			<mine-list :mine-list="mineRight"></mine-list>
		</view>
		<view class='flex-row-between segment-Head mt-base'>
			<text class="text-gray-700 ml-lg text-sm">自助服务</text>
		</view>
		<view class="mt-base mx-lg flex flex-row items-center justify-around pb-base border-bt">
			<mine-list :mine-list="mineService"></mine-list>
		</view>
		<view class='flex-row-between segment-Head mt-base'>
			<text class="text-gray-700 ml-lg text-sm">联系我们</text>
		</view>
		<view class="mt-base mx-lg flex flex-row items-center justify-around pb-base">
			<mine-list :mine-list="mineContact"></mine-list>
		</view>
	</view>
</template>

<script setup>
	import {ref, reactive} from 'vue';
	import navbar from '@/uni_modules/login/nav-bar.vue';
	import listItem from '@/uni_modules/login/list-item.vue';
	import mineList from '@/uni_modules/login/mine-list.vue';
	
	const title  = ref('我的界面title');
	const userName = ref('曹汝涛');
	
	//我的订单列表
	const mineOrder = reactive([
		{
			picName: '/static/mine/payment.svg',
			remark: '待付款',
			badge: 0
		},
		{
			picName: '/static/mine/shipment.svg',
			remark: '待发货',
			badge: 4
		},
		{
			picName: '/static/mine/delivery.svg',
			remark: '待收货',
			badge: 3
		},
		{
			picName: '/static/mine/review.svg',
			remark: '待评价',
			badge: 10
		},
		{
			picName: '/static/mine/refund.svg',
			remark: '退货/售后',
			badge: 1
		},
	]);
	
	//我的权益列表
	const mineRight = reactive([
		{
			picName: '/static/mine/payment.svg',
			remark: '回收订单'
		},
		{
			picName: '/static/mine/shipment.svg',
			remark: 'H码专项'
		},
		{
			picName: '/static/mine/payment.svg',
			remark: '优惠券'
		},
		{
			picName: '/static/mine/payment.svg',
			remark: '活动'
		},
		{
			picName: '/static/mine/payment.svg',
			remark: '足迹'
		},
	]);
	
	//自助服务列表
	const mineService = reactive([
		{
			picName: '/static/mine/payment.svg',
			remark: '发票查询'
		},
		{
			picName: '/static/mine/shipment.svg',
			remark: '发票管理'
		},
		{
			picName: '/static/mine/payment.svg',
			remark: '收货地址'
		},
		{
			picName: '/static/mine/payment.svg',
			remark: '活动公告'
		}
	]);
	
	//联系我们列表
	const mineContact = reactive([
		{
			picName: '/static/mine/payment.svg',
			remark: '在线客服'
		},
		{
			picName: '/static/mine/shipment.svg',
			remark: '售后热线'
		},
		{
			picName: '/static/mine/payment.svg',
			remark: '意见反馈'
		},
		{
			picName: '/static/mine/payment.svg',
			remark: '常见问题'
		}
	]);
	
	
	const login = function(e){
		uni.showModal({
			title: '提示',
			content:'login的值:' + e + ", userName的值:" + userName.value,
			confirmText:'确定',
			showCancel: false
		})
	}
	const badgeText = ref("15");
	const avatar = ref("待付款");
	
</script>

<style scoped lang="scss">
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
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
	
	.border-bt {
		border-bottom: 4px solid var(--gray-200);
	}
</style>

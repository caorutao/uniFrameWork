<template>
	<view class="content">
		<uni-card :is-full="false" is-shadow title="card组件" sub-title="组件测试">
			<view class="cardContent">
					<image class="logo selectable-img" :class="{active:isSelected}" src="/static/template.png"></image>
					<image class="logo selectable-img" :class="{active:isSelected}" src="/static/template.png"></image>
					<image class="logo selectable-img" :class="{active:isSelected}" src="/static/template.png"></image>
					<text class="title">{{title}}</text>
					<button type="primary" style="margin-top: 20px;" size="mini"
						@tap="selectImg">选中/未选中</button>
			</view>
		</uni-card>
		<view style="overflow: hidden;">
			<view  class="flex-row-between"
				:class="{scaleWidthSelected:isSelected,scaleWidth:!isSelected}" style="width: 700rpx; height: 80rpx; background-color: antiquewhite;">
				<text class="title">{{title}}</text>
				<text class="title">{{title}}</text>
			</view>
		</view>
	</view>
	<my-fat top="200rpx" left="150rpx" :contents="content" radius="25px"
		@fabClick="fabClick" @fabItemClick="fabItemClick"></my-fat>
</template>

<script setup>
	import { ref, computed} from 'vue';
	import myFat from '@/uni_modules/login/myFat.vue';
	
	let title = ref('未选中的状态');
	let isSelected = ref(false);
	
	const selectImg = () => {
		title.value = (title.value === "未选中的状态")?'选中的状态':"未选中的状态";
		isSelected.value = !(isSelected.value)
	}
	
	const myfat = ref();
	
	const content = ref([
		{
			icon: '/static/api.svg',
			selectedIcon: '/static/apiHL.svg',
			text: '项目1',
			selected:false
		}, 
		{
			icon: '/static/extui.png',
			selectedIcon: '/static/extuiHL.png',
			text: '项目2',
			selected:false
		},
		{
			icon: '/static/component.svg',
			selectedIcon: '/static/componentHL.svg',
			text: '项目3',
			selected:false
		},
		{
			icon: '/static/api.svg',
			selectedIcon: '/static/apiHL.svg',
			text: '项目4',
			selected:false
		}]);
	
	const fabClick = () => {
		
	}
	
	const fabItemClick = (e) => {
		content.value.forEach((item)=>item.selected=false); 
		content.value[e.index].selected = !e.item.selected
	}
	
</script>

<style scoped>
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
		height: 50rpx;
		width: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 24rpx;
		color: #8f8f94;
	}	
	
	.selectable-img.active {
		 background-color: #007aff; /* 选中：蓝色，直接改色值就行 */
	}
	
	.scaleWidth {
		margin-left: 20rpx;
		transform: scaleX(0.2);
		transform-origin: left center;
		transition: transform 0.4s linear;
	}
	
	.scaleWidthSelected {
		margin-left: 20rpx;
		transform: scaleX(0.3);
		transform-origin: left center;
	}
	
</style>

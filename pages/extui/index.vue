<template>
	<view class="content">
		<uni-card :is-full="false" is-shadow title="card组件" sub-title="组件测试">
			<view class="cardContent">
					<image class="logo selectable-img" :class="{active:isSelected}" src="/static/extui.png"></image>
					<image class="logo selectable-img" :class="{active:isSelected}" src="/static/extui.png"></image>
					<image class="logo selectable-img" :class="{active:isSelected}" src="/static/extui.png"></image>
					<text class="title">{{title}}</text>
					<button type="primary" style="margin-top: 20px;" size="mini"
						@tap="selectImg">选中/未选中</button>
			</view>
		</uni-card>
		
	</view>
</template>

<script setup>
	import { ref, computed} from 'vue';
	
	let title = ref('未选中的状态');
	let isSelected = ref(false);
	
	const selectImg = () => {
		title.value = (title.value === "未选中的状态")?'选中的状态':"未选中的状态";
		isSelected.value = (isSelected.value)?false:true;
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
		margin-top: 0rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 0rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
	
	.selectable-img {
		width: 100%;
		height: 100%;
		transition: background-color 0.25s ease;
		/* 核心：全平台通用的遮罩变色，一行搞定 */
		opacity: 0;
		-webkit-mask: url("/static/extui.png") center/contain no-repeat;
		mask: url("/static/extui.png") center/contain no-repeat;
		background-color: #ccc; /* 未选中：灰色 */
	}
	
	.selectable-img.active {
		 background-color: #007aff; /* 选中：蓝色，直接改色值就行 */
		/*
		filter: brightness(0) saturate(100%) invert(30%) sepia(98%) saturate(2675%) hue-rotate(201deg) brightness(100%) contrast(101%);
		*/
	}
	
	
</style>

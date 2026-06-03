<template>
  <view class="content">
	<uni-card is-full is-shadow title="card组件" sub-title="组件测试">
		<view class="cardContent">
			<button type="primary">点击按钮</button>
		</view>
	</uni-card>
    <!-- 可拖动的悬浮按钮 -->
    <DraggableFab
      v-model:open="fabOpen"
      :pattern="pattern"
      :content="content"
      :enableLongPress="false"
      @click="handleFabClick"
      @itemClick="handleItemClick"
    />
  </view>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import DraggableFab from '@/uni_modules/login/DraggableFab.vue';

	const fabOpen = ref(true)

	const pattern = {
	  color: '#7A7E83',
	  backgroundColor: '#fff',
	  buttonColor: '#007AFF'
	}

	const content = [
	  {
		iconPath: '/static/icon1.png',
		activeIconPath: '/static/icon1-active.png',
		text: '功能1'
	  },
	  {
		iconPath: '/static/icon2.png',
		activeIconPath: '/static/icon2-active.png',
		text: '功能2'
	  }
	]

	const handleFabClick = () => {
	  console.log('主按钮被点击了')
	}

	const handleItemClick = (e: any) => {
	  console.log('子菜单被点击了:', e.detail)
	}
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
</style>

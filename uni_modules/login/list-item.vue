<template>
	<view class="flex-col-center">
		<uni-badge type="error" :text="badge" absolute="rightTop" :offset="[-3, 0]">
			<image class="img" :src="picName" mode="scaleToFill"></image>
		</uni-badge>
		<text  class="text-gray-600 text-sm font-medium scale text-ellipsis">{{remark}}</text>
	</view>
</template>

<script setup>
	const { picName, remark } = defineProps({
		picName:{
			type: String,
			default: ''
		},
		remark: {
			type: String,
			default: ''
		},
		badge: {
			type: Number,
			default: 0
		}
	})
</script>

<style scoped>
	.img {
		width:20px;
		height: 20px;
	}
	.scale {
		transform: scale(0.85);
	}
	
	.badge {
		position: absolute;
		top:0px;
		right: 0px;
	}
</style>

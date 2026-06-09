<template>
	<view class="flex-col-center align-items-center relative">
		<uni-badge class="barge-z-index" type="error" :text="badge" absolute="rightTop" :offset="[-15,1]"></uni-badge>
		<image class="img" :src="picName" mode="scaleToFill"></image>
		<text  class="text-gray-600 text-sm font-medium text-ellipsis">{{remark}}</text>
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
	.relative {
		position: relative;
	}
	.align-items-center {
		align-items: center;
	}
	.img {
		width: 30px;
		height: 30px;
	}
	.badge-fix {
		position: absolute;
		top:-10px;
		right: -10px;
	}
	.barge-z-index {
		z-index: 99!important;
	}
</style>

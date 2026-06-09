<template>
	<view class="content">
		<view class="flex-row-between mt_img">
			<slot>
				<view class="loginitems ml-lg gap-base">
					<image class="imageleft" :class="{'img': isHover}" src="/static/avatar.svg" 
						mode="scaleToFill" @tap="login"> </image>
					<text class="text-white text-sm" :class="{'text-active': isActive}" @tap="login($event)">登录/注册</text>
				</view>
				<view class="loginitems gap-base mr-lg">
					<image class="imageright" :class="{'img': isHover}" src="/static/communication.svg" mode="original"></image>
					<uni-badge type="error" :text='badge' absolute="rightTop" :offset="[3, 3]" size="small">
						<image class="imageright mt-xs" 
						:class="{'img': isHover}" src="/static/set.svg" mode="original"></image>
					</uni-badge>
				</view>
			</slot>
		</view>
	</view>
</template>

<script setup>
	const {isHover, isActive, badgeText, modelValue} = defineProps({
		isHover:{
			type:Boolean,
			default:false
		},
		isActive:{
			type:Boolean , 
			default: false
		}, 
		badge: {
			type: String,
			default: ''
		}, 
		modelValue: {
			type: String,
			default : ''
		}
	});	
	
	const emit = defineEmits(['update:modelValue', 'login']);
	
	const login = () => {
		emit('update:modelValue', '青岛');
		emit('login', '江中');
	}
</script>

<style scoped lang="scss">
	.content {
		height: 350rpx;
		background-color: $haixin_lightlv;
	}
	.mt_img {
		margin-top: 200rpx;
	}
	.imageleft {
		width:30px;
		height:30px;
	}
	
	.imageright {
		width:20px;
		height:20px;
	}
	
	.loginitems {
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	
	.img:active {
		transition:0.2s;
		transform:scale(1.5);
	}
	
	.text-active:active {
		transform: scale(1.5);
	}
	
</style>
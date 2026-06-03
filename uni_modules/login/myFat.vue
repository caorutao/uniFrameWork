<template>
	<view class="mycontent"
		:style="contentStyle"
		style="background-color: antiquewhite;">
		<view class="box" :style="boxStyle" @tap="pop">
			<uni-icons class='boxIcons' :class="{'boxIcons_active':isShow}" type="plusempty" size="22" color="#ffffff"></uni-icons>
		</view>
		<view class="fab" :class="{fab_active:isShow, 'mr-base':isShow, 'ml-xs': isShow, 'pb-5':isShow}"
			:style="{width:boxWidth, gap:props.itemsGap}">
			<view class='fabItem'
				:style="fabItemStyle"
				v-for="(item, index) in props.contents" :key="index" @tap="itemClick(index)">
				<image class="img" :src="item.seleted?item?.selectedIcon:item?.icon" mode="scaleToFill"></image>
				<text class="fabItem_text">{{item.text}}</text>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref, computed } from 'vue';
		
	/**
	 * fab 弹出式菜单
	 * @description 弹出式菜单
	 * @property {Json} contents 子菜单的列表
	 * @property {String} top    组件上边位置
	 * @property {String} left   组件左边位置
	 * @property {String} width  左边+图片外框宽度
	 * @property {String} height 左边+图片外框高度
	 * @property {String} padT   右边子菜单的上padding
	 * @property {String} padB   右边子菜单的下padding
	 * @property {String} itemsGap 项目之间的间距
	 * @property {String} radius 整体及左边图片弯角
	 * @event {Function} click   点击 Card 触发事件
	 */
	const props = defineProps({
		contents: {
			type: Object,
			default:()=>({})
		},
		top:{
			type: String,
			default: ''
		},
		left:{
			type: String,
			default: ''
		},
		width:{
			type: String,
			default: '40px'
		},
		height: {
			type: String,
			default: '40px'
		}, 
		padT:{
			type: String,
			default: '2rpx'
		},
		padB: {
			type: String,
			default: '5rpx'
		}, 
		itemsGap: {
			type: String,
			default: '10px'
		},
		radius: {
			type: String,
			default: '45rpx'
		},
	})
	
	/**
	 * 用于处理fab组件的位置
	 * 判断top、bottom、left、right那个不为空用那个
	 */
	const contentStyle = computed(() => {
		const style = {};
		if(!isEmpty(props.top)) {
			style.top = props.top;
		}
		if(!isEmpty(props.left)) {
			style.left = props.left;
		}
		style.borderRadius = props.radius;
		return style;
	})
	
	/**
	 * 处理左边图片的宽度和高度
	 */
	const boxStyle = computed(()=>{
		const style = {};
		style.width = props.width;
		style.height = props.height;
		style.borderRadius = props.radius;
		return style;
	})
	
	/**
	 * 计算子菜单的宽高，和box的宽高一致
	 */
	const fabItemStyle = computed(()=>{
		return {...boxStyle.value};
	})
	
	//字符串非空判断
	const isEmpty = (val) => {
		if(val === null && val.toString().trim() === "") {
			return true;
		}
		return false;
	}
	
	//子列表弹出/收起标记
	const isShow = ref(true);
	
	const styles = {
		color: '#888',
		selectedColor: '#007AFF',
		backgroundColor: '#fff',
		buttonColor: '#007AFF',
		iconColor: '#fff',
		icon: 'plusempty'
	};				
	
	/**
	 * 点击左边按钮，实现缩放功能
	 */
	const pop = () => {
		isShow.value = !isShow.value
	}
	
	/**
	 * 缩放时重新计算子菜单的宽度，
	 */
	const boxWidth = computed(() => {
		if(isShow.value) {
			return (props.contents.length*getNumber(props.width)) + ((props.contents.length - 1)*getNumber(props.itemsGap)) + 'px';
		} else {
			return '0px';
		}
	});
	

	/**
	 * 截取字符串中的数字和小数点并转化为数字 
	 */
	const getNumber = (val) => {
		const res = String(val).replace(/[^\d.]/g, '');
		return res? Number(res):0; 
	}
	
</script>

<style scoped lang="scss">
	$uni-shadow-base:0 1px 5px 2px rgba($color: #000000, $alpha: 0.3) !default;
	
	.mycontent {
		position: fixed;
		z-index: 8;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		box-shadow: $uni-shadow-base;
	}
	.box {
		background-color: blue;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
	.fab {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		height: 40px;
		opacity: 0;
		// overflow: hidden;
		// transition: width 0.2s, opacity 0.1s;
		transform-origin: left center;
		transform: scaleX(0);
		transition:transform 0.2s ease;
	}
	.fab_active {
		opacity: 1;
		transform-origin: left center;
		transform: scaleX(1);
		transition: transform 0.2s ease;
	}
	.fabItem {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		transform: scale(0.9);
	}
	.img {
		width:26px;
		height: 26px;
	}
	.fabItem_text {
		color: #888;
		font-size: 12px;
		line-height: 12px;
	}
	.boxIcons {
		transform: rotate(0deg);
		transition: transform 0.3s;
		font-weight: 200;
	}
	.boxIcons_active {
		transform: rotate(45deg);
	}
	.pb-5{
		padding-top: 2px;
		padding-bottom: 5px;
	}
</style>
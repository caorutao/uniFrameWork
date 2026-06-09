<template>
	<view class="mt-base mx-base flex flex-row items-center justify-around pb-lg"
		v-for="(item, index) in mineList" :key="index">
		<listItem :pic-name='item.picName' :remark='item.remark' :badge="item.badge"></listItem>
	</view>
</template>

<script setup>
	import listItem from '@/uni_modules/login/list-item.vue';
	
	const { mineList } = defineProps({
		mineList: {
			type: Array,
			default: []
		}
	})
	
</script>

<style scoped lang="scss">
</style>
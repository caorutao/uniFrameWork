<template>
  <!-- 可拖动区域容器 -->
  <movable-area class="movable-area">
    <!-- 可拖动的fab -->
    <movable-view
      class="movable-fab"
      :x="fabX"
      :y="fabY"
      direction="all"
      :inertia="false"
      :out-of-bounds="false"
      @change="handleChange"
      @touchstart="handleTouchStart"
      @touchend="handleTouchEnd"
      @longpress="handleLongPress"
    >
      <uni-fab
        ref="fabRef"
        v-bind="$attrs"
        :popMenu="true"
        :style="{ pointerEvents: isDragging ? 'none' : 'auto' }"
        @update:open="handleUpdateOpen"
      >
        <template v-for="(_, name) in $slots" #[name]="slotData">
          <slot :name="name" v-bind="slotData || {}"></slot>
        </template>
      </uni-fab>
    </movable-view>
  </movable-area>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

// 组件属性定义
interface Props {
  open?: boolean
  fabSize?: number
  fabMargin?: number
  autoAdsorb?: boolean
  rememberPosition?: boolean
  storageKey?: string
  enableLongPress?: boolean
  longPressTime?: number
  dragOpacity?: number
}

const props = withDefaults(defineProps<Props>(), {
  open: true,
  fabSize: 56,
  fabMargin: 15,
  autoAdsorb: true,
  rememberPosition: true,
  storageKey: 'draggable-fab-position',
  enableLongPress: false,
  longPressTime: 500,
  dragOpacity: 0.7
})

// 组件事件定义
const emit = defineEmits<{
  'update:open': [value: boolean]
  'click': []
  'dragStart': []
  'dragEnd': [position: { x: number; y: number }]
  'longPress': []
}>()

// 内部状态
const fabRef = ref(null)
const isDragging = ref(false)
const isLongPress = ref(false)
const fabX = ref(0)
const fabY = ref(0)
const initialX = ref(0)
const initialY = ref(0)

// 屏幕信息
const screenInfo = ref({
  width: 0,
  height: 0,
  statusBarHeight: 0,
  safeAreaBottom: 0
})

// 动态样式
const fabStyle = computed(() => {
  return {
    opacity: isDragging.value ? props.dragOpacity : 1,
    transition: isDragging.value ? 'none' : 'all 0.15s ease-out'
  }
})

// 监听子菜单展开状态变化
const handleUpdateOpen = (value: boolean) => {
  emit('update:open', value)
}

// 初始化位置
const initPosition = () => {
  const sysInfo = uni.getSystemInfoSync()
  screenInfo.value = {
    width: sysInfo.windowWidth,
    height: sysInfo.windowHeight,
    statusBarHeight: sysInfo.statusBarHeight || 0,
    safeAreaBottom: sysInfo.safeAreaInsets?.bottom || 0
  }

  if (props.rememberPosition) {
	uni.removeStorageSync(props.storageKey);
    const savedPosition = uni.getStorageSync(props.storageKey)
	
    if (savedPosition) {
      fabX.value = savedPosition.x
      fabY.value = savedPosition.y
      return
    }
  }

  // 默认位置：右下角
  //console.log('initPosition事件:', screenInfo.value.width, props.fabSize, props.fabMargin, screenInfo.value.safeAreaBottom);
  fabX.value = screenInfo.value.width - props.fabSize - props.fabMargin
  fabY.value = screenInfo.value.height - props.fabSize - props.fabMargin - screenInfo.value.safeAreaBottom
}

// 触摸开始
const handleTouchStart = () => {
  initialX.value = fabX.value
  initialY.value = fabY.value
  isDragging.value = false
  isLongPress.value = false
}

// 拖动中
const handleChange = (e: any) => {
  // 如果启用了长按触发拖动，只有长按后才能拖动
  if (props.enableLongPress && !isLongPress.value) {
    // 强制恢复到初始位置
    fabX.value = initialX.value
    fabY.value = initialY.value
    return
  }

  if (!isDragging.value) {
    isDragging.value = true
    emit('dragStart')
    // 拖动时自动收起子菜单
    // ✅ 拖动时自动收起子菜单（最终正确实现）
        if (fabRef.value && fabRef.value.showContent) {
          fabRef.value.close()
        }
  }
  //console.log('handleChange事件执行了', props.open);
}

// 触摸结束
const handleTouchEnd = () => {
  if (isDragging.value) {
    // 自动吸附到最近的左右边缘
    if (props.autoAdsorb) {
      const screenCenterX = screenInfo.value.width / 2
      if (fabX.value + props.fabSize / 2 < screenCenterX) {
        fabX.value = props.fabMargin
      } else {
        fabX.value = screenInfo.value.width - props.fabSize - props.fabMargin
      }
    }

    // 保存位置
    if (props.rememberPosition) {
      uni.setStorageSync(props.storageKey, {
        x: fabX.value,
        y: fabY.value
      })
    }

    emit('dragEnd', { x: fabX.value, y: fabY.value })
    
    setTimeout(() => {
      isDragging.value = false
      isLongPress.value = false
    }, 50)
  } else {
    // 不是拖动，触发点击事件
    if (!isLongPress.value) {
      emit('click')
    }
  }
}

// 长按事件
const handleLongPress = () => {
  if (props.enableLongPress) {
    isLongPress.value = true
    emit('longPress')
    emit('update:open', false)
    // #ifdef APP-IOS
    uni.vibrateShort()
    // #endif
  }
}

// 监听屏幕旋转
const handleResize = () => {
  initPosition()
}

onMounted(() => {
  initPosition()
  uni.onWindowResize(handleResize)
})

onUnmounted(() => {
  uni.offWindowResize(handleResize)
})
</script>

<style scoped>
/* 可拖动区域占满整个屏幕 */
.movable-area {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 999998;
  pointer-events: none; /* 关键：不影响页面其他元素的点击 */
}

/* 可拖动的fab */
.movable-fab {
  width: 56px;
  height: 56px;
  z-index: 999999;
  pointer-events: auto; /* 关键：只有fab区域可以点击 */
}
</style>
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps<{
  page: number
  video?: boolean
  videoClass?: string
  showVideoLink?: boolean
}>()

const videoElement = ref<HTMLVideoElement>()
const number = computed(() => String(props.page).padStart(3, '0'))
const base = import.meta.env.BASE_URL || '/'
const imageUrl = computed(() => `${base}slides/slide-${number.value}.webp`)
const videoUrl = computed(() => `${base}media/slide-${number.value}.mp4`)
let observer: IntersectionObserver | undefined

onMounted(() => {
  const element = videoElement.value
  if (!element || window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    return

  if (!('IntersectionObserver' in window)) {
    void element.play().catch(() => {})
    return
  }

  observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting)
      void element.play().catch(() => {})
    else
      element.pause()
  }, { threshold: 0.15 })
  observer.observe(element)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  videoElement.value?.pause()
})
</script>

<template>
  <div class="ppt-frame">
    <img
      class="ppt-image"
      :src="imageUrl"
      :alt="`演讲幻灯片第 ${page} 页`"
      draggable="false"
      loading="lazy"
    >
    <video
      v-if="video"
      ref="videoElement"
      class="ppt-video"
      :class="videoClass"
      :src="videoUrl"
      :poster="imageUrl"
      :aria-label="`第 ${page} 页嵌入演示视频`"
      controls
      muted
      loop
      playsinline
      preload="metadata"
    />
    <a
      v-if="showVideoLink"
      class="ppt-video-link"
      href="https://www.bilibili.com/video/BV1xtnY6REby/"
      target="_blank"
      rel="noreferrer"
      aria-label="在哔哩哔哩观看完整演讲视频（新窗口打开）"
    >
      观看完整演讲视频 · bilibili <span aria-hidden="true">↗</span>
    </a>
  </div>
</template>

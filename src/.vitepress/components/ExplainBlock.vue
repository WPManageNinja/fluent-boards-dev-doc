<template>
    <div class="hook_explain">
        <h3 class="explain_header" :id="titleId" @click="isOpen = !isOpen">
            {{ title }}
            <a class="header-anchor" :href="'#' + titleId" :aria-label="'Permalink to ' + title" @click.stop>&#8203;</a>
            <span class="hook_dir" :class="{ is_open: isOpen }" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.46967 8.96967C6.76256 8.67678 7.23744 8.67678 7.53033 8.96967L12 13.4393L16.4697 8.96967C16.7626 8.67678 17.2374 8.67678 17.5303 8.96967C17.8232 9.26256 17.8232 9.73744 17.5303 10.0303L12.5303 15.0303C12.3897 15.171 12.1989 15.25 12 15.25C11.8011 15.25 11.6103 15.171 11.4697 15.0303L6.46967 10.0303C6.17678 9.73744 6.17678 9.26256 6.46967 8.96967Z" fill="currentColor"/></svg>
            </span>
        </h3>
        <div class="hook_body" v-show="isOpen">
            <slot></slot>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'

const props = defineProps({
    title: { type: String, required: true }
})

const isOpen = ref(false)
const titleId = computed(() => props.title.replace(/[^a-zA-Z0-9_]/g, '_'))

// Open the block when the page is loaded with its anchor in the URL
onMounted(() => {
    if (window.location.hash === '#' + titleId.value) {
        isOpen.value = true
    }
})
</script>

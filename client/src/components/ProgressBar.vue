<template>
    <div class="w-full h-12 bg-gray-200 rounded relative overflow-hidden">
        <div
            class="absolute bg-blue-500 h-full transition-[width]"
            :style="{
                width: percent + '%',
            }"
        ></div>
        <div class="flex w-full h-full items-center justify-center opacity-25">{{ percent }}%</div>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, type PropType } from 'vue';

const props = defineProps({
    total: {
        type: Number,
        required: true,
    },
    current: {
        type: Number,
        required: true,
    },
});

const percent = computed(() => Math.round((100 * props.current) / props.total));
</script>

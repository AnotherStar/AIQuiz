<template>
    <div>
        <div class="text-[20px] text-slate-500">{{ label }}</div>
        <slot></slot>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import useApi from '@composables/useApi';

const props = defineProps({
    label: {
        type: String,
        required: true,
    },
});
</script>

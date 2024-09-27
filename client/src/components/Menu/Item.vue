<template>
    <RouterLink
        :to="to"
        class="rounded p-4 text-center bg-gray-200 font-bold text-[20px] hover:bg-gray-400 hover:text-white"
    >
        <slot></slot>
    </RouterLink>
</template>

<script lang="ts" setup>
const props = defineProps({
    to: {
        type: String,
        required: true,
    },
});
</script>

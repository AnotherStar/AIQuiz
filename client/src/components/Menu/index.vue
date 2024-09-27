<template>
    <div class="relative container mx-auto rounded bg-gray-100 uppercase shadow overflow-y-scroll">
        <div
            class="absolute w-full h-full flex items-center justify-center bg-white transition-opacity pointer-events-none"
            :class="isLoading ? 'opacity-50' : 'opacity-0'"
        >
            {{ isLoading }}
            <svg
                class="animate-spin -ml-1 mr-3 h-12 w-12 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="gray"
                    stroke-width="4"
                ></circle>
                <path
                    class="opacity-75"
                    fill="black"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
            </svg>
        </div>
        <div class="flex flex-col space-y-4 p-4">
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import useApi from '@composables/useApi';

const props = defineProps({
    isLoading: {
        type: Boolean,
        default: false,
    },
});
</script>

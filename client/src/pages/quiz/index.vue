<template>
    <div class="menu-wrapper">
        <BackButton />

        <Menu>
            <MenuItem v-for="quiz of quizzes" :to="`/quiz/${quiz.id}`">{{ quiz.theme }}</MenuItem>
        </Menu>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import useApi from '@composables/useApi';
import { computedAsync } from '@vueuse/core';

const { Api } = useApi();

const quizzes = computedAsync(() => Api.Quiz.getList());
</script>

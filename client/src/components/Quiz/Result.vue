<template>
    <Menu class="flex flex-col space-y-4 justify-center items-center align-center">
        <div class="text-[100px] text-center text-sky-500 font-bold">{{ percent }}%</div>
        <img :src="imageSrc" class="w-[150px] mx-auto" />
        <div class="text-center">
            Вы ответили правильно на {{ correctQuestions }} из {{ quiz.questions.length }}
        </div>
    </Menu>
</template>

<script lang="ts" setup>
import { Quiz } from '@server/quiz/quiz.service';
import { ref, computed, type PropType } from 'vue';

const props = defineProps({
    quiz: {
        type: Object as PropType<Quiz>,
        required: true,
    },
});

const correctQuestions = computed(
    () => props.quiz.questions.filter(x => x.answer === x.rightAnswerIndex).length,
);

const percent = computed(() =>
    Math.round((100 * correctQuestions.value) / props.quiz.questions.length),
);

const imageSrc = computed(() => {
    if (percent.value >= 90) return '/place-1.png';
    if (percent.value >= 50) return '/place-2.png';
    return '/place-3.png';
});
</script>

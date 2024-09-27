<template>
    <div class="flex flex-row flex-wrap gap-2 mx-auto">
        <div
            v-for="(question, questionIndex) in quiz.questions"
            :key="`question_${questionIndex}`"
            class="w-4 h-4 flex items-center justify-center rounded-full transition-all font-bold bg-opacity-50 text-white"
            :class="{
                'bg-green-500':
                    question.answer !== undefined && question.answer === question.rightAnswerIndex,
                'bg-red-500':
                    question.answer !== undefined && question.answer !== question.rightAnswerIndex,
                'bg-gray-200': question.answer === undefined,
                'scale-150': activeIndex === questionIndex,
            }"
            @click="() => emit('go-to', questionIndex)"
        >
            {{ questionIndex + 1 }}
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Quiz } from '@server/quiz/quiz.service';
import { ref, computed, type PropType } from 'vue';

const props = defineProps({
    quiz: {
        type: Object as PropType<Quiz>,
        required: true,
    },
    activeIndex: {
        type: Number,
        required: true,
    },
});

const emit = defineEmits<{
    'go-to': [number];
}>();
</script>

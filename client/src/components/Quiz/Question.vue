<template>
    <Menu>
        <div class="mb-4 text-center text-[30px] text-slate-600">
            {{ question.message }}
        </div>
        <div class="flex flex-col space-y-2">
            <div
                v-for="(answer, answerIndex) in question.answers"
                :key="`answer_${answerIndex}`"
                class="rounded p-2"
                @click="emit('set-answer', answerIndex)"
                :class="{
                    'bg-green-500':
                        question.answer !== undefined && answerIndex === question.rightAnswerIndex,
                    'bg-red-500':
                        question.answer !== undefined &&
                        answerIndex === question.answer &&
                        answerIndex !== question.rightAnswerIndex,
                    'bg-gray-200': question.answer === undefined,
                }"
            >
                {{ answerIndex + 1 }}: {{ answer }}
            </div>
        </div>
        <div class="italic text-[20px]" v-if="isAnswered">
            <b>{{ isCorrect ? 'Верно!' : 'Не верно!' }}</b>
            {{ question.explain }}
        </div>
        <!-- <div class="flex space-x-2 text-slate-500">
            <button>Подсказка</button>
            <button>Пожаловаться</button>
        </div> -->
    </Menu>
</template>

<script lang="ts" setup>
import { PropType, computed } from 'vue';
import { Question } from '@server/quiz/quiz.service';

const props = defineProps({
    question: {
        type: Object as PropType<Question>,
        required: true,
    },
    index: {
        type: Number,
        required: true,
    },
});

const setAnswer = (index: number) => {
    props.question.answer = index;
};

const isAnswered = computed(() => props.question.answer !== undefined);

const isCorrect = computed(
    () => isAnswered.value && props.question.answer === props.question.rightAnswerIndex,
);

const emit = defineEmits<{
    'set-answer': [number];
}>();
</script>

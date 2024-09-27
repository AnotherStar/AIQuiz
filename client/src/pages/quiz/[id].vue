<template>
    <div class="p-4">
        <BackButton />
    </div>

    <QuizBoard v-if="quiz" :quiz="quiz" />

    <!-- <div class="container mx-auto my-8" v-if="quiz">
        <h1 class="text-center text-[30px]">{{ quiz.theme }}</h1>
        <h1 class="text-center text-[30px]">
            {{ quiz.questions.filter(x => x.answer !== undefined).length }} /
            {{ quiz.questions.length }}
        </h1>
        <div class="p-4 text-gray text-center">
            <div>{{ quiz.difficulty }}, {{ quiz.age }}</div>
        </div>
        <div class="flex flex-col space-y-8">
            <div
                class="bg-gray-100 rounded p-4 space-y-4"
                v-for="(question, questionIndex) of quiz.questions"
                :key="`question_${questionIndex}`"
            >
                <div class="text-[20px] text-slate-800">{{ question.message }}</div>
                <div class="flex flex-row space-x-4 w-full justify-around">
                    <div
                        v-for="(answer, answerIndex) of question.answers"
                        :key="`answer_${answerIndex}`"
                        class="bg-gray-200 p-4 rounded hover:outline cursor-pointer"
                        @click="question.answer = answerIndex"
                        :class="{
                            'bg-green-500':
                                question.answer !== undefined &&
                                answerIndex === question.rightAnswerIndex,
                            'bg-red-500':
                                question.answer !== undefined &&
                                answerIndex === question.answer &&
                                answerIndex !== question.rightAnswerIndex,
                        }"
                    >
                        {{ answer }}
                    </div>
                </div>
                <div class="italic text-gray-500" v-if="question.answer !== undefined">
                    {{ question.explain }}
                </div>
            </div>
        </div>
    </div> -->
</template>

<script lang="ts" setup>
import { computedAsync } from '@vueuse/core';
import { onMounted, ref } from 'vue';
import useApi from '@composables/useApi';
import { Quiz } from '@server/quiz/quiz.service';

const { Api } = useApi();

const props = defineProps({
    id: {
        type: String,
        required: true,
    },
});

const quiz = ref<Quiz>();
onMounted(async () => {
    quiz.value = await Api.Quiz.getItem(props.id);
});
</script>

<template>
    <div class="px-4 py-4 flex flex-col space-y-2">
        <div class="text-white text-center text-[30px]">{{ quiz.theme }}</div>
        <!-- <ProgressBar :current="current" :total="total" /> -->
        <ProgressDots
            v-if="swiper"
            :quiz="quiz"
            @go-to="index => swiper.slideTo(index)"
            :active-index="swiper.activeIndex"
        />
    </div>

    <div class="swiper mb-8" style="width: calc(100% - 2rem); overflow: visible">
        <!-- Additional required wrapper -->
        <div class="swiper-wrapper">
            <!-- Slides -->
            <div
                class="swiper-slide"
                style="width: 90%"
                v-for="(question, questionIndex) in quiz.questions"
                :key="`questionIndex_${questionIndex}`"
            >
                <QuizQuestion
                    :index="questionIndex"
                    :question="question"
                    @set-answer="index => setAnswer(question, index)"
                />
            </div>
            <div class="swiper-slide">
                <QuizResult :quiz="quiz" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, PropType, ref, onMounted } from 'vue';
import { Quiz, Question } from '@server/quiz/quiz.service';
// import Swiper bundle with all modules installed
import Swiper from 'swiper/bundle';

// import styles bundle
import 'swiper/css/bundle';

const props = defineProps({
    quiz: {
        type: Object as PropType<Quiz>,
        required: true,
    },
});

const currentQuestionIndex = ref(0);

const current = computed(() => props.quiz.questions.filter(x => x.answer !== undefined).length);
const total = computed(() => props.quiz.questions.length);

const swiper = ref<Swiper>();

let autoSwipeTimeout: NodeJS.Timeout;

const setAnswer = (question: Question, answer: number) => {
    question.answer = answer;
    autoSwipeTimeout = setTimeout(() => {
        swiper.value.slideNext();
    }, 4000);
};

onMounted(() => {
    swiper.value = new Swiper('.swiper', {
        speed: 500,
        direction: 'horizontal',
        loop: false,
        on: {
            touchStart: () => {
                if (autoSwipeTimeout) clearTimeout(autoSwipeTimeout);
            },
        },
        autoHeight: false,
        spaceBetween: 15,
    });
});
</script>

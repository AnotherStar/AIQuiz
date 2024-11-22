<template>
    <div class="px-4 py-4 flex flex-col space-y-2">
        <div class="text-white text-center text-[30px]">{{ quiz.theme }}</div>
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
                    :media-player="mediaPlayer"
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
import Swiper from 'swiper';
import axios from 'axios';
import { MediaPlayer } from '@composables/useMedia';

// import styles bundle
import 'swiper/css/bundle';
import { computedAsync } from '@vueuse/core';

const props = defineProps({
    quiz: {
        type: Object as PropType<Quiz>,
        required: true,
    },
});

const swiper = ref<Swiper>();

let autoSwipeTimeout: NodeJS.Timeout;

const setAnswer = (question: Question, answer: number) => {
    console.log(question);
    question.answer = answer;

    if (question.rightAnswer === question.answers[answer]) {
        setTimeout(() => {
            mediaPlayer.value.play(`correct`);
        }, 500);
        setTimeout(() => {
            mediaPlayer.value.play(`explain-${question.index}`);
        }, 2000);
        setTimeout(() => {
            // swiper.value.slideNext();
        }, 6000);
    } else {
        setTimeout(() => {
            mediaPlayer.value.play(`incorrect`);
        }, 500);
        setTimeout(() => {
            mediaPlayer.value.play(`explain-${question.index}`);
        }, 2000);
        setTimeout(() => {
            // swiper.value.slideNext();
        }, 6000);
    }
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
            slideChangeTransitionEnd: () => {
                const index = swiper.value?.activeIndex;
                if (index === undefined) return;

                const question = props.quiz.questions[index];
                mediaPlayer.value.play(`question-${question.index}`);
            },
        },
        autoHeight: false,
        spaceBetween: 15,
    });
});

const mediaPlayer = ref<MediaPlayer>(new MediaPlayer());

onMounted(async () => {
    const media = await axios
        .get(`/api/quiz/${props.quiz.id}/media`)
        .then(response => response.data);

    mediaPlayer.value.addMedia(media);

    mediaPlayer.value.play('theme');
});

Object.assign(window, { mediaPlayer });
</script>

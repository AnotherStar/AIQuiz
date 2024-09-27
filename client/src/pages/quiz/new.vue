<template>
    <div class="menu-wrapper">
        <BackButton />

        <Menu :is-loading="isLoading">
            <div v-if="isLoading" class="flex flex-col space-y-4">
                <ProgressBar :total="total" :current="current" />
                Придумываем квиз...
            </div>
            <template v-else>
                <MenuInput label="Тема квиза">
                    <input type="text" v-model="theme" placeholder="" />
                </MenuInput>

                <MenuInput :label="`Возраст ${age}`">
                    <input
                        type="range"
                        v-model.number="age"
                        min="5"
                        max="99"
                        step="1"
                        placeholder="Ваш возраст"
                    />
                </MenuInput>

                <MenuInput :label="`Количество вопросов ${questionsCount}`">
                    <input
                        type="range"
                        v-model.number="questionsCount"
                        min="10"
                        max="30"
                        step="5"
                    />
                </MenuInput>

                <MenuInput :label="`Сложность ${difficulty} / 5`">
                    <input
                        type="range"
                        v-model.number="difficulty"
                        min="1"
                        max="5"
                        step="1"
                        placeholder="Сложность"
                    />
                </MenuInput>

                <button :disabled="disabled" @click="() => generate()">Сгенерировать</button>
            </template>
        </Menu>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import useApi from '@composables/useApi';
import useUser from '@composables/useUser';
import { useRouter } from 'vue-router';

const router = useRouter();

const { user } = useUser();

const { Api } = useApi();
const theme = ref('');
const age = ref(user.value.age);
const difficulty = ref(3);

const isLoading = ref(false);

const disabled = computed(() => theme.value.length < 5);

const current = ref(0);
const total = ref(30);
const questionsCount = ref(10);

let interval: NodeJS.Timeout;

const generate = () => {
    if (isLoading.value) return;
    isLoading.value = true;

    current.value = 0;
    total.value = 60;

    interval = setInterval(() => {
        current.value++;
        if (current.value > 100) current.value = 100;
    }, 1000);

    Api.Quiz.generate(theme.value, age.value, difficulty.value, questionsCount.value)
        .then(quiz => {
            router.push(`/quiz/${quiz.id}`);
        })
        .finally(() => {
            isLoading.value = false;
        })
        .finally(() => {
            clearInterval(interval);
        });
};
</script>

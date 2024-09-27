<template>
    <div class="menu-wrapper">
        <BackButton />

        <Menu :is-loading="isLoading">
            <MenuInput label="Телефон">
                <input type="text" v-model="user.phone" />
            </MenuInput>

            <MenuInput label="Код для входа">
                <input type="number" v-model="code" />
            </MenuInput>

            <button @click="getSms" :disabled="disabled">Получить СМС код</button>
        </Menu>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import useUser from '@composables/useUser';
const { user } = useUser();

const isLoading = ref(false);

const disabled = computed(() => user.value.phone.length < 10);
const code = ref('');

const getSms = () => {
    isLoading.value = true;
    setTimeout(() => {
        code.value = Math.round(Math.random() * 900 + 1000).toString();
        isLoading.value = false;
    }, 2000);
};
</script>

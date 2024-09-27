<template>
    <div class="menu-wrapper">
        <BackButton />

        <Menu>
            <MenuInput label="Накнейм">
                <input type="string" v-model="user.username" />
            </MenuInput>

            <MenuInput :label="`Возраст ${user.age}`">
                <input type="range" v-model="user.age" :min="5" :max="99" step="1" />
            </MenuInput>
        </Menu>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import useApi from '@composables/useApi';
import useUser from '@composables/useUser';
const { user } = useUser();

const name = ref('');
</script>

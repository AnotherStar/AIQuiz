<template>
    <div class="menu-wrapper">
        <Menu>
            <img src="/logo.png" class="h-48 w-48 mx-auto mix-blend-multiply" />
            <MenuItem to="/quiz/new" style="">Новый квиз</MenuItem>
            <MenuItem to="/quiz">Готовые</MenuItem>
            <MenuItem to="/settings">Настройки</MenuItem>
            <MenuItem to="/login">Вход</MenuItem>
        </Menu>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import useApi from '@composables/useApi';
</script>

import { useStorage } from '@vueuse/core';

interface User {
    username: string;
    phone: string;
    age: number | undefined;
    language: string;
}

const user = useStorage<User>('users', {
    username: '',
    phone: '',
    age: undefined,
    language: 'ru',
});

export default () => ({
    user,
});

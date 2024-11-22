interface MediaData {
    base64: string | string[];
    name: string;
    type: 'mp3';
}

export class MediaPlayer {
    public mediaLibrary: Map<string, HTMLAudioElement[]>;

    constructor() {
        this.mediaLibrary = new Map(); // Хранилище для медиафайлов (имя => объект Audio)
    }

    /**
     * Добавляет медиафайл в библиотеку
     * @param {Object} data - Данные медиафайла
     * @param {string} data.base64 - Base64 строка медиафайла
     * @param {string} data.name - Уникальное имя медиафайла
     * @param {string} data.type - Тип медиа (поддерживается только 'mp3')
     * @returns {MediaPlayer} - Возвращает экземпляр MediaPlayer для цепочки вызовов
     */
    addMedia(data: MediaData | MediaData[]) {
        if (Array.isArray(data)) {
            data.forEach(x => this.addMedia(x));
            return this;
        }

        const { base64, name, type } = data;

        if (type !== 'mp3') {
            throw new Error('Только формат mp3 поддерживается!');
        }

        if (this.mediaLibrary.has(name)) {
            throw new Error(`Медиа с именем "${name}" уже существует!`);
        }

        let audioArray: HTMLAudioElement[];

        if (Array.isArray(base64)) {
            audioArray = base64.map(b => this.getAudioFromBase64(b));
        } else {
            audioArray = [this.getAudioFromBase64(base64)];
        }

        // Сохраняем в библиотеку
        this.mediaLibrary.set(name, audioArray);

        return this; // Возвращаем this для цепочки вызовов
    }

    private getAudioFromBase64(base64: string): HTMLAudioElement {
        // Убираем префикс, если он есть
        const base64Content = base64.includes('base64,') ? base64.split(',')[1] : base64;

        // Декодируем Base64 и создаем Blob
        const binaryString = atob(encodeURI(base64Content));
        const byteArray = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            byteArray[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([byteArray], { type: 'audio/mpeg' });

        // Создаем объект Audio
        const audioUrl = URL.createObjectURL(blob);
        const audio = new Audio(audioUrl);
        return audio;
    }

    /**
     * Воспроизводит медиафайл по имени
     * @param {string} name - Имя медиафайла
     * @returns {MediaPlayer} - Возвращает экземпляр MediaPlayer для цепочки вызовов
     */
    play(name: string) {
        const audios = this.mediaLibrary.get(name) || [];
        const audio = audios[0];

        if (!audio) {
            console.error(`Медиа с именем "${name}" не найдено!`);
            return this;
        }

        // // Останавливаем, если другой аудио уже играет
        // this.mediaLibrary.forEach(audio => {
        //     if (!audio.paused && audio !== audio) {
        //         audio.pause();
        //         audio.currentTime = 0; // Сбрасываем позицию
        //     }
        // });

        // Воспроизводим выбранное аудио
        audio.play().catch(error => {
            console.error(`Ошибка воспроизведения "${name}":`, error);
        });

        return this; // Возвращаем this для цепочки вызовов
    }
}

const apps = [
    {
        name: 'Nest backend quiz',
        kill_timeout: 5000,
        wait_ready: true,
        script: 'cd server && node dist/main.js',
        autorestart: true,
        time: true,
        log_date_format: 'YYYY-MM-DD HH:mm:ss.SSS Z',
    },
];

const deploy = {
    production: {
        user: 'root',
        host: 'quiz.another-star.ru',
        ref: 'origin/main',
        repo: 'git@github.com:AnotherStar/AIQuiz.git',
        path: '/var/www/quiz.another-star.ru',
        'post-deploy':
            'node -v && cd client && npm install && npm run build && cd ../server && npm install && npm run build && cd ../ && pm2 reload ecosystem.config.js --env production',
    },
};

module.exports = {
    apps,
    deploy,
};

const apps = [
    {
        name: 'Nest backend',
        kill_timeout: 5000,
        wait_ready: true,
        script: 'cd server && dist/main.js',
        autorestart: true,
        node_args: ['--color'],
        time: true,
        log_date_format: 'YYYY-MM-DD HH:mm:ss.SSS Z',
    },
];

module.exports = {
    apps,
};

module.exports = {
  apps: [
    {
      name: "booking-backend",
      script: "npm run start",
      env: {
        NODE_ENV: "production",
      },
      watch: false,
      max_restarts: 10,
      restart_delay: 4000,
      autorestart: true
    },
  ],
};

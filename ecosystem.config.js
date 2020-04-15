module.exports = {
  apps: [
    {
      name: "malekaiCDN",
      script: "malekaiCDN.js",
      watch: true,
      max_restarts: 3,
      restart_delay: 4000,
      max_memory_restart: "100M",
      autorestart: true
    }
  ]
};

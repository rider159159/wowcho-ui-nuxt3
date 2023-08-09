module.exports = {
  apps: [
    {
      name: 'WowCho-nuxt',
      port: '3000',
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs',
      max_memory_restart: '512M',
    }
  ]
}
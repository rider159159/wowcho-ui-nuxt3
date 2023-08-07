export default defineNuxtConfig({
  // dayjs-nuxt
  modules: ['nuxt-swiper','@pinia/nuxt','@unocss/nuxt',],
  swiper: {
    // prefix: 'Swiper',
    // styleLang: 'css',
    modules: ['navigation', 'pagination'], // all modules are imported by default
  },
  devtools: { enabled: true },
  "imports": {
    "dirs": ['stores']
  },
  css: [
    "/assets/style/style.scss", // you should add main.scss somewhere in your app
    'uno.css',
    '@unocss/reset/tailwind-compat.css',
    '@mdi/font/css/materialdesignicons.min.css'
  ],
  "app": {
    "head": {
      "viewport": "width=500, initial-scale=1",
      "title": "Nuxt3 高效入門全攻略",
      "meta": [
        { "name": "description", "content": "這是 Mike 的 Nuxt3 高效入門全攻略課程" },
        { "property": "og:title", "content": "Nuxt3 高效入門全攻略" },
        { "property": "og:url", "content": "http://localhost:3000/" },
        { "property": "og:description", "content": "這是 Mike 的 Nuxt3 高效入門全攻略課程" },
      ],
      link: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;700;900&display=swap",
        },
      ],
    }
  },
  "vite": {
    "define": {
      "process.env": process.env,
    },
  },

})

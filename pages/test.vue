<script setup >
const runtimeConfig = useRuntimeConfig()
const { apiBaseURL } = runtimeConfig.public
</script>


<template>
  <h1>測試業面</h1>
  {{apiBaseURL}}
</template>
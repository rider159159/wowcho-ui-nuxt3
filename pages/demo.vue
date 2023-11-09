<script setup>

const form = ref({
  time: 0
})
</script>

<template>
  <main>
    <div>demo</div>
    <VueDatePicker v-model="form.time"></VueDatePicker>
    <GSAP></GSAP>
    <ClientOnly>
      <Map></Map>
    </ClientOnly>
  </main>
</template>
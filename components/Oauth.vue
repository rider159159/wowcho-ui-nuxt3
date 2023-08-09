
<script setup>
const emits = defineEmits(['oauthLoginSuccess'])
const runtimeConfig = useRuntimeConfig()
const { apiBaseURL,oauthID } = runtimeConfig.public

async function handleCredentialResponse (response) {
  const formBody = {
    token: response.credential
  }
  const res = await $fetch("/login/oauth",{
    body:formBody,
    baseURL: apiBaseURL,
    method:'POST',
  })
  if (res.status !== 'Success') return
  SET_TOKEN(res.data.token)
  emits('oauthLoginSuccess')
}

onMounted(() => {
  window.handleCredentialResponse = handleCredentialResponse
  // 在這裡動態加載 Google SDK
  const script = document.createElement('script')
  script.src = 'https://accounts.google.com/gsi/client'
  script.async = true
  script.defer = true
  document.head.appendChild(script)
})
</script>

<template>
  <div class="flex justify-center">
    <div id="g_id_onload"
      :data-client_id="oauthID"
      data-context="signin"
      data-ux_mode="popup"
      data-callback="handleCredentialResponse"
      data-auto_prompt="false">
    </div>

    <div class="g_id_signin"
      data-type="standard"
      data-shape="rectangular"
      data-theme="outline"
      data-text="signin_with"
      data-size="large"
      data-logo_alignment="left">
    </div>
  </div>
</template>

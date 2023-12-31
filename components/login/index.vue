<script setup>
import { storeToRefs } from 'pinia'
const { $swal } = useNuxtApp()
const inSevenDays = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
const  cookie = useCookie('wowcho',{
  expires:inSevenDays
})
const config = useRuntimeConfig()

const store = userInfoStore()
const { USER_INFO_REF } = storeToRefs(store)
const emits = defineEmits(['switchToSignup', 'closeModal', 'loginTure'])
const router = useRouter()
const LOGIN_STORE = userLoginStore()

// 密碼顯示切換
const passwordShow = ref(true)
const passwordType = ref('password')

async function oauthLoginSuccess() {
  await getProfile()
  loginSuccess()
}

function togglePasswordType(show, type) {
  passwordShow.value = show
  passwordType.value = type
}

async function submitForm(value) {
  const res = await $fetch("/login",{
    body:value,
    baseURL: config.public.BASE_API_URL,
    method:'POST',
  })
  if (res.status !== 'Success') return
  cookie.value = res.data.token
  await getProfile()
}

async function getProfile() {
  const res = await $fetch("/profile",{
    baseURL: config.public.BASE_API_URL,
    method:'GET',
    headers:{
      Authorization:`Bearer ${cookie.value}`
    },
  })
  if (res.status !== 'Success') return
  // 正常狀態使用 loginSuccess
  USER_INFO_REF.value = res.data
  loginSuccess()
}

// 登入成功，關閉彈窗，切換頁面，並打個人資料 API
function loginSuccess() {
  $swal.fire({
    icon: 'success',
    title: '登入成功',
    confirmButtonText: '確定',
    confirmButtonColor: '#2378BF',
    timer: 3000
  })

  setTimeout(() => {
    emits('closeModal')
    // 前往頁面有值，才做頁面切換，否則停留此頁
    if (LOGIN_STORE.TO_ROUTE.length >= 2) {
      router.push(LOGIN_STORE.TO_ROUTE)
      LOGIN_STORE.TO_ROUTE = ''
    }
  }, 2000)
}

</script>

<template>
  <section class="flex flex-col items-center w-full px-4">
    <VForm @submit="submitForm" v-slot="{ errors }" class="w-full md:w-90% flex flex-col gap-4 md:mb-12">
      <img src="/footer_logo.svg" alt="">
      <div class="text-h3 text-center my-10px">
        <span class="mdi mdi-account-circle text-h3 text-brand6"></span> 登入
      </div>
      <div class="text-14px">
        尚未成為會員?
        <button type="button" @click="emits('switchToSignup')" class="text-brand2 bg-white">註冊帳號</button>
      </div>

      <Oauth @oauthLoginSuccess="oauthLoginSuccess"></Oauth>

      <div>
        <label for="account" class="flex flex-col">
          <p class="mb-2 h6">帳號</p>
          <VField type="text" name="account" label="帳號" rules="required" placeholder="請輸入帳號" id="account"
            class="w-full h-48px text-h6 leading-h4 px-2 rounded-8px b-2px border-line focus:outline-none focus:border-brand3"
            :class="{'!border-#FF5D71':errors.account}"
          />
        </label>
        <span v-if="errors.account" class="block text-#FF5D71 text-14px">{{ errors.account }}</span>
      </div>
      <div>
        <label for="password" class="flex flex-col">
          <p class="mb-2">密碼</p>
          <VField name="password" label="密碼" rules="required|password" v-slot="{ field }">
            <div class="relative">
              <input v-bind="field" :type="passwordType" placeholder="請輸入密碼" id="password"
                class="w-full h-48px text-h6 leading-h4 px-2 rounded-8px b-2px border-line focus:outline-none focus:border-brand3"
                :class="{'!border-#FF5D71':errors.password}">
              <span v-if="passwordShow" @click="togglePasswordType(false,'text')" class="mdi mdi-eye text-h4 absolute cursor-pointer top-3 right-4 cursor-pointer"></span>
              <span v-if="!passwordShow" @click="togglePasswordType(true,'password')" class="mdi mdi-eye-off text-h4 absolute cursor-pointer top-3 right-4 cursor-pointer"></span>
            </div>
          </VField>
        </label>
        <span v-if="errors.password" class="block text-#FF5D71 text-14px">{{ errors.password }}</span>
      </div>
      <button @keyup.enter="submitForm" type="submit" class="mt-4 w-full py-2 py-2 bg-brand-1 hover:bg-brand-2 duration-300 text-white rounded-3xl">登入</button>
    </VForm>

  </section>
</template>

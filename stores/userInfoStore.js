import { defineStore } from 'pinia'

const UserInfo = {
  account: '',
  name: '',
  username: '',
  gender: 0,
  email: '',
  image: null,
  address: null,
  birthday: null,
  customizedUrl: null,
  isSubscribed: true,
  isAllowedNotifications:true,
  website: null, // 個人網站,
  youtube: null, // YT 網址
  instagram: null,
  facebook: null,
  businessName: '',// 商業檔案 名稱
  businessEmail: '', // 商業檔案 email
}

export const userInfoStore = defineStore('user-info-store', () => {
  const USER_INFO_REF = ref({ ...UserInfo })
  const USER_LOGIN_ROUTE_REF = ref('')

  function FN_LOGOUT() {
    USER_INFO_REF.value = UserInfo
    $REMOVE_TOKEN()
  };

  return {
    USER_INFO_REF,
    FN_LOGOUT,
    USER_LOGIN_ROUTE_REF
  }
})

<script setup>
import { storeToRefs } from 'pinia'
const { SEARCH_REF, SEARCH_CONTROL } = storeToRefs(searchStore())
const config = useRuntimeConfig()

const route = useRoute()
const router = useRouter()

// 分類列表
const categories = [
  {
    title: '社會',
    value: 1
  },
  {
    title: '出版',
    value: 2
  },
  {
    title: '影音',
    value: 3
  },
  {
    title: '娛樂',
    value: 4
  },
  {
    title: '生活',
    value: 5
  },
  {
    title: '設計',
    value: 6
  },
  {
    title: '科技',
    value: 7
  },
  {
    title: '休閒',
    value: 8
  }
]

// 排序列表
const sortList = [
  {
    title: '時間由新到舊',
    value: 1
  },
  {
    title: '時間由舊到新',
    value: 2
  },
  {
    title: '募資總金額由大到小',
    value: 3
  },
  {
    title: '募資總金額由小到大',
    value: 4
  }
]

// 取得資料
const totalCount = ref(0)
const proposalList = ref([])

const query = ref({
  search: '',
  category: 0,
  order: 0,
  page: 1,
  pageSize: 12
})

// 獲得募資活動
const { data: proposalData = {
  list:[]
}, refresh:proposalRefresh } = await useAsyncData(
  'proposal',
  () => $fetch('/proposal',{
  baseURL: config.public.BASE_API_URL,
  method:'GET',
  params:query.value,
})
  )

// async function getApiData() {
//   query.value.search = ''
//   SEARCH_REF.value = ''
//   const res  = await $fetch("/proposal",{
//     baseURL: config.public.BASE_API_URL,
//     method:'GET',
//     params:query.value,
//   })
//   if(res.status !== 'Success') return
//   proposalList.value = res.data.list
//   totalCount.value  = res.data.totalCount
// }
// 分類篩選相關
// 分類下拉標題
const categoryTitle = ref('')

// 選擇分類
function filterSelectCategory(item) {
  query.value.category = item.value
  query.value.page = 1
  categoryTitle.value = item.title
  proposalRefresh()
}
// 分類 HTML
const categoriesRef = ref(null)
// 分類下拉控制
const isShowCategories = ref(false)

function closeCategories() {
  isShowCategories.value = false
}
useClickOutside(categoriesRef, closeCategories)

// 排序相關
const sortTitle = ref('')
const sortRef = ref(null)
const isShowSortList = ref(false)

// 選擇排序
function sortProducts(item) {
  query.value.order = item.value
  sortTitle.value = item.title
  proposalRefresh()
}

function closeSort() {
  isShowSortList.value = false
}
useClickOutside(sortRef, closeSort)


async function searchData() {
  query.value.category = 0
  query.value.order = 0
  const res  = await $fetch("/proposal/search",{
    baseURL: config.public.BASE_API_URL,
    method:'GET',
    params:query.value,
  })
  data.value = res
}

// 取消搜尋
function clearSearch() {
  SEARCH_REF.value = ''
  router.replace({
    query: {}
  })
  query.value = {}
  proposalRefresh()
}

// 初始化
async function init() {
  // query 有帶上 category 使用 category 做 getApiData 搜尋
  if (route.query.category) {
    query.value.category = Number(route.query.category)
    const category = categories.find((item) => item.value === Number(route.query.category))
    if (category) categoryTitle.value = category.title
  } else if (route.query.order) {
    query.value.order = Number(route.query.order)
    const sort = sortList.find((item) => item.value === Number(route.query.order))
    if (sort) sortTitle.value = sort.title
  } else if (route.query.search) { // 有帶上 search 時 query 帶上並使用 searchData 搜尋
    query.value.search = String(route.query.search)
    searchData()
  }
  proposalRefresh()
}
// init()

// SEARCH_CONTROL.value 由 Header 元件操作
watch(
  () => SEARCH_CONTROL.value,
  () => {
    // query 帶上 search 並調整 query
    query.value.search = SEARCH_REF.value
    router.replace({
      query: { search: query.value.search }
    })
    searchData()
  })

watch(
  () => query.value.page,
  () => {
    return getApiData()
  }
)

</script>

<template>
  <div class="px-4 container mx-auto">
    <div v-if="query.search.length>1" class="flex w-full justify-center py-4">
      <p>從「{{ query.search }}」找到 {{ data.totalCount }} 個有關的專案。</p>
      <div @click="clearSearch" class="text-brand-2 cursor-pointer">取消搜尋</div>
    </div>
    <div class="md:flex md:justify-between items-center mb-10">
      <!-- 專案類別篩選 -->
      <div class="relative  mb-4 md:mb-0">
        <div ref="categoriesRef" @click="isShowCategories = !isShowCategories" class="flex justify-between items-center bg-white border-1 border-gray-3 rounded w-full md:w-50 cursor-pointer px-4 py-1">
          {{ query.category !== 0 ? categoryTitle : '專案類別' }}
          <svg v-if="!isShowCategories" width='12' height='12' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><rect width='24' height='24' stroke='none' fill='#000000' opacity='0'/>
            <g transform="matrix(0.5 0 0 0.5 12 12)" >
            <path style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" translate(-24, -23.2)" d="M 40.394 41 L 7.606 41 C 6.303 41 5.1370000000000005 40.326 4.486 39.198 C 3.834999999999999 38.07 3.835 36.722 4.486 35.594 L 20.88 7.2 L 20.88 7.2 C 21.531 6.072 22.697 5.399 24 5.399 C 25.303 5.399 26.469 6.072 27.12 7.2 L 43.513999999999996 35.595 C 44.165 36.723 44.165 38.071 43.513999999999996 39.199 C 42.86299999999999 40.327 41.696 41 40.394 41 z" stroke-linecap="round" />
            </g>
          </svg>
          <svg v-else width='12' height='12' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><rect width='24' height='24' stroke='none' fill='#000000' opacity='0'/>
            <g transform="matrix(0.91 0 0 0.91 12 12)" >
            <path style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" translate(-12, -13)" d="M 22.777 4.983 C 22.443 4.377 21.791 4 21.074 4 L 2.926 4 C 2.209 4 1.557 4.377 1.223 4.983 C 0.905 5.561 0.927 6.24 1.281 6.798 L 10.355 21.113 C 10.706 21.669 11.321 22 12 22 C 12.679 22 13.294 21.669 13.646 21.114 L 22.72 6.799000000000001 C 23.073 6.24 23.095 5.561 22.777 4.983 z" stroke-linecap="round" />
            </g>
          </svg>
        </div>
        <ul v-if="isShowCategories" class="absolute z-10 bg-white border-1 border-gray-3 mt-1">
          <li
            class="rounded w-50 cursor-pointer px-4 py-2 hover:text-brand-2 active:text-brand-2"
            :class="{'text-brand-2': query.category === 0}"
            @click="filterSelectCategory({value:0 , title: '全部' })"
          >
            全部
          </li>
          <li
            v-for="(category, key) in categories"
            :key="`${category}_${key}`"
            class="rounded w-50 cursor-pointer px-4 py-2 hover:text-brand-2 active:text-brand-2"
            :class="{'text-brand-2': query.category === (key+1)}"
            @click="filterSelectCategory(category)"
          >
            {{ category.title }}
          </li>
        </ul>
      </div>
      <div class="flex flex-col-reverse gap-y-4 md:gap-y-0 md:flex-row items-center gap-x-4">

        <!-- 排序選擇 -->
        <div class="relative w-full">
          <div ref="sortRef" @click="isShowSortList = !isShowSortList" class="flex justify-between items-center bg-white border-1 border-gray-3 rounded md:w-50 cursor-pointer px-4 py-1">
            {{ query.order !== 0 ? sortTitle : '排序' }}
            <svg v-if="!isShowSortList" width='12' height='12' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><rect width='24' height='24' stroke='none' fill='#000000' opacity='0'/>
              <g transform="matrix(0.5 0 0 0.5 12 12)" >
              <path style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" translate(-24, -23.2)" d="M 40.394 41 L 7.606 41 C 6.303 41 5.1370000000000005 40.326 4.486 39.198 C 3.834999999999999 38.07 3.835 36.722 4.486 35.594 L 20.88 7.2 L 20.88 7.2 C 21.531 6.072 22.697 5.399 24 5.399 C 25.303 5.399 26.469 6.072 27.12 7.2 L 43.513999999999996 35.595 C 44.165 36.723 44.165 38.071 43.513999999999996 39.199 C 42.86299999999999 40.327 41.696 41 40.394 41 z" stroke-linecap="round" />
              </g>
            </svg>
            <svg v-else width='12' height='12' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><rect width='24' height='24' stroke='none' fill='#000000' opacity='0'/>
              <g transform="matrix(0.91 0 0 0.91 12 12)" >
              <path style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;" transform=" translate(-12, -13)" d="M 22.777 4.983 C 22.443 4.377 21.791 4 21.074 4 L 2.926 4 C 2.209 4 1.557 4.377 1.223 4.983 C 0.905 5.561 0.927 6.24 1.281 6.798 L 10.355 21.113 C 10.706 21.669 11.321 22 12 22 C 12.679 22 13.294 21.669 13.646 21.114 L 22.72 6.799000000000001 C 23.073 6.24 23.095 5.561 22.777 4.983 z" stroke-linecap="round" />
              </g>
            </svg>
          </div>
          <ul v-if="isShowSortList" class="absolute z-10 bg-white border-1 border-gray-3 mt-1">
            <li
              v-for="(sort, key) in sortList"
              :key="`${sort}_${key}`"
              class="rounded w-50 cursor-pointer px-4 py-2 hover:text-brand-2 active:text-brand-2"
              :class="{'text-brand-2': query.order === (key+1)}"
              @click="sortProducts(sort)"
            >
              {{ sort.title }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 商品列表 -->
    <ul v-if="proposalData.list.length > 0"  class="md:flex flex-wrap gap-x-2%">
      <li
        v-for="product in proposalData.data.list"
        :key="product._id"
        class="w-full md:w-49% lg:w-32%"
      >
        <NuxtLink :to="`/proposal/${product.customizedUrl}`">
          <!-- TODO: 商品圖片、目前金額、募資達標率待串接 -->
          <CommonProductCard
            :image="product.image"
            :title="product.name"
            :current-price="product.nowPrice"
            :target-price="product.targetPrice"
            :end-time="product.endTime"
          />
        </NuxtLink>
      </li>
    </ul>
    <!-- 沒有資料顯示文字 -->
    <div v-else class="mb-8">
      <p class="text-center">目前尚無資料</p>
    </div>
    <!-- 分頁 -->
    <CommonMyPagination
      v-if="totalCount > 0"
      class="mb-10"
      v-model="query.page"
      :page-size="12"
      :total="totalCount"
    />

  </div>
</template>

import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import JoinView from '../views/JoinView.vue'
import store from '@/store'
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  //로그인 테스트
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue'),
    meta: {auth : true}
  },
  //로그인
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  //회원가입
  {
    path: '/join',
    name: 'join',
    component: JoinView
  },
  //점심 랜덤 뽑기
  {
    path: '/eats',
    name: 'eats',
    component: () => import('../views/eats/EatsView.vue'),
    meta: {auth : false}
  },

  {//지은 페이지 
    path: '/tissue',
    name: 'tissue',
    component: () => import('../views/jieun/JieunView.vue'),
  },
  //
  {
    path: '/sunhj',
    name: 'sunhj',
    component: () => import('../views/sun/TmpView.vue'),
    meta: {auth : false}
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next)=>{
  const userId = store.state.user.userId;

  if(to.matched.some(r=>r.meta.auth) && userId == null){
    alert('로그인이 필요한 페이지입니다!');
    next('/login')
  }else{
    next()
  }
})

export default router

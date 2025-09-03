import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginView from '../views/LoginView.vue'
import SignupView from '../views/SignupView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login' // 初期画面はログイン
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignupView
  },
  {
    path: '/diary',
    name: 'diary',
    component: () => import('@/views/DiaryView.vue')
  },
  {
    path: '/diarylist',
    name: 'diarylist',
    component: () => import('@/views/DiarylistView.vue')
  },
  {
  path: "/diaries/:id",
  name: "DiaryDetail",
  component: () => import("@/views/DiaryDetailView.vue"),
  props: true
  },
  {
  path: '/drafts',
  name: 'DraftList',
  component: () => import("@/views/DraftListView.vue"),
  props: true
  },
  {
    path: '/drafts/:id/edit',
    name: 'DraftEdit', // ここを DraftEdit に統一
    component: () => import('@/views/DiaryView.vue'), 
    props: true
  },
  {
  path: '/change-password',
  name: 'ChangePassword',
  component: () => import('@/views/PasswordChangeView.vue')
  },
  {
  path: '/change-name',
  name: 'ChangeName',
  component: () => import('@/views/NameChangeView.vue')
  },
  {
  path: '/change-headercolor',
  name: 'ChangeHeaderColor',
  component: () => import('@/views/HeaderColorChangeView.vue')
  },
  {
  path: '/change-backgroundcolor',
  name: 'ChangeBackgroundColor',
  component: () => import('@/views/BackgroundColorChangeView.vue')
  },
  {
  path: '/statistics',
  name: 'Statistics',
  component: () => import('@/views/StatisticsView.vue')
  }






]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

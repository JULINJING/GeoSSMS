import VueRouter from 'vue-router'
import Vue from 'vue'

import Scene from '../components/Scene/Scene'
import Login from '../components/Login/Login'

// import store from '@/store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from "@/store";

const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)
const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/scene',
        name: 'scene',
        component: Scene
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/404',
        name: '404',
        component: () => import('@/components/404/404.vue')
    }
]
var router = new VueRouter({
    routes: routes,
    mode: 'history'
})

NProgress.inc(0.2)
NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false })


// 提供一个重置路由的方法
export const resetRouter = () => {
    router.matcher = new VueRouter({
        mode: 'history',
        base: process.env.BASE_URL,
        routes
    })
}


//用路由守卫来做nav显示
router.beforeEach((to, from, next) => {
    NProgress.start()
    // store.dispatch('setBarTitle', to.name)


    localStorage.setItem("currentPathName", to.name)  // 设置当前的路由名称
    store.commit("setPath")
    // 未找到路由的情况
    if (!to.matched.length) {
        const storeMenus = localStorage.getItem("menus")
        if (storeMenus) {
            next("/404")
        } else {
            // 跳回登录页面
            next("/login")
        }
    }
    // 其他的情况都放行
    next()
})
router.afterEach(() => {
    NProgress.done()
})



export default router

import Vue from 'vue'
import VueRouter from 'vue-router'
import HelloWorld from "@/components/HelloWorld";
import SearchPage from "@/components/SearchPage";

Vue.use(VueRouter)
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
const routes = [
    {
        path:"/",
        name:"hello",
        component:HelloWorld
    },
    {
        path:"/search",
        name:"search",
        component:SearchPage
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router

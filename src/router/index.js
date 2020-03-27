import Vue from "vue";
import VueRouter from "vue-router";
import Calendar from "../views/Calendar";
import Home from "../views/Home";
import DoneEventsList from "../views/DoneEventsList";
import DoneEvent from '../views/DoneEvent'
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/calendar",
    name: "Calendar",
    component: Calendar
  },
  {
    path: "/done-events-list",
    name: "DoneEventsList",
    component: DoneEventsList
  },
  {
    path: '/done-events-list/:name',
    props: true,
    name: 'DoneEvent',
    component: DoneEvent
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;

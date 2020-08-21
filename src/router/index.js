import Vue from 'vue'
import Router from 'vue-router'

import menu from "../components/gameMenu"

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'gameMenu',
      component: menu,
      meta: {mouseRightMenu: false, mouseSelect: false}
    },
    {
      path: "/minesweeper",
      name: "minesweeper",
      component: () => import("../components/minesweeper/minesweeper"),
      meta: {mouseRightMenu: false, mouseSelect: false}
    },
    {
      path: "/snake",
      name: "snake",
      component: () => import("../components/snake/snake"),
      meta: {mouseRightMenu: false, mouseSelect: false}
    },
    {
      path: "/color",
      name: "color",
      component: () => import("../components/color/color"),
      meta: {mouseRightMenu: false, mouseSelect: false}
    },
    {
      path: "/link",
      name: "link",
      component: () => import("../components/link/link"),
      meta: {mouseRightMenu: false, mouseSelect: false}
    },
    {
      path: "/jump",
      name: "jump",
      component: () => import("../components/jump/jump"),
      meta: {mouseRightMenu: false, mouseSelect: false}
    },
    {
      path: "/picross",
      name: "picross",
      component: () => import("../components/picross/picross"),
      meta: {mouseRightMenu: false, mouseSelect: false}
    },
    {
      path: "/digital",
      name: "digital",
      component: () => import("../components/digital/digital"),
      meta: {mouseRightMenu: false, mouseSelect: true}
    },
    {
      path: "/wolf",
      name: "wolf",
      component: () => import("../components/wolf/wolf"),
      meta: {mouseRightMenu: false, mouseSelect: true}
    },
    {
      path: "/graduate",
      name: "graduate",
      component: () => import('../components/graduate/graduate'),
      meta: {mouseRightMenu: false, mouseSelect: false}
    },
    {
      path: "/eco",
      name: "eco",
      component: () => import("../components/eco/eco"),
      meta: {mouseRightMenu: false, mouseSelect: false}
    },
    {
      path: "/cssDraw",
      name: "cssDraw",
      component: () => import("../components/cssDraw/cssDraw"),
      meta: {mouseRightMenu: false, mouseSelect: false}
    },
    {
      path: "/tripleDisaster",
      name: "tripleDisaster",
      component: () => import("../components/tripleDisaster/tripleDisaster"),
      meta: {mouseRightMenu: false, mouseSelect: false}
    },
    {
      path: "/ccc",
      name: "ccc",
      component: () => import("../components/ccc/ccc"),
      meta: {mouseRightMenu: true, mouseSelect: true}
    },
    {
      path: "/magicCube",
      name: "magicCube",
      component: () => import("../components/magicCube/magicCube"),
      meta: {mouseRightMenu: false, mouseSelect: false}
    },
    {
      path: "/gangEditor",
      name: "gangEditor",
      component: () => import('../components/gangEditor/gangEditor'),
      meta: {mouseRightMenu: false, mouseSelect: false}
    },
    {
      path: "/gangCompany",
      name: "gangCompany",
      component: () => import('../components/gangCompany/gangCompany'),
      meta: {mouseRightMenu: false, mouseSelect: false}
    },
    {
      path: "/animal",
      name: "animal",
      component: () => import('../components/animal/animal'),
      meta: {mouseRightMenu: false, mouseSelect: false}
    },
    {
      path: "/road2CTO",
      name: "road2CTO",
      component: () => import('../components/road2CTO/road2CTO'),
      meta: {mouseRightMenu: false, mouseSelect: false}
    },
    {
      path: "/coc",
      name: "coc",
      component: () => import('../components/coc/coc'),
      meta: {mouseRightMenu: true, mouseSelect: true}
    },
    {
      path: "/light",
      name: "light",
      component: () => import('../components/light/light'),
      meta: {mouseRightMenu: false, mouseSelect: false}
    },
  ]
})

router.afterEach((to, from) => {
  //右键菜单
  document.oncontextmenu = function(){
    event.returnValue = to.meta.mouseRightMenu;
  };
  //选择文本
  document.onselectstart = function(){
    event.returnValue = to.meta.mouseSelect;
  };
})

export default router

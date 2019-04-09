import Vue from 'vue'
import Router from 'vue-router'

import menu from "../components/gameMenu"

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'gameMenu',
      component: menu
    },
    {
      path: "/minesweeper",
      name: "minesweeper",
      component: resolve => require(['@/components/minesweeper/minesweeper'], resolve)
    },
    {
      path: "/snake",
      name: "snake",
      component: resolve => require(['@/components/snake/snake'], resolve)
    },
    {
      path: "/color",
      name: "color",
      component: resolve => require(['@/components/color/color'], resolve)
    },
    {
      path: "/link",
      name: "link",
      component: resolve => require(['@/components/link/link'], resolve)
    },
    {
      path: "/jump",
      name: "jump",
      component: resolve => require(['@/components/jump/jump'], resolve)
    },
    {
      path: "/picross",
      name: "picross",
      component: resolve => require(['@/components/picross/picross'], resolve)
    },
    {
      path: "/digital",
      name: "digital",
      component: resolve => require(['@/components/digital/digital'], resolve)
    },
    {
      path: "/wolf",
      name: "wolf",
      component: resolve => require(['@/components/wolf/wolf'], resolve)
    },
    {
      path: "/graduate",
      name: "graduate",
      component: resolve => require(['@/components/graduate/graduate'], resolve)
    },
    {
      path: "/eco",
      name: "eco",
      component: resolve => require(['@/components/eco/eco'], resolve)
    },
    {
      path: "/cssDraw",
      name: "cssDraw",
      component: resolve => require(['@/components/cssDraw/cssDraw'], resolve)
    },
    {
      path: "/tower",
      name: "tower",
      component: resolve => require(['@/components/tower/tower'], resolve)
    },
    {
      path: "/ccc",
      name: "ccc",
      component: resolve => require(['@/components/ccc/ccc'], resolve)
    },
    {
      path: "/magicCube",
      name: "three",
      component: resolve => require(['@/components/magicCube/magicCube'], resolve)
    },
  ]
})

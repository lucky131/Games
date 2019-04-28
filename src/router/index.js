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
      component: () => import("../components/minesweeper/minesweeper")
    },
    {
      path: "/snake",
      name: "snake",
      component: () => import("../components/snake/snake")
    },
    {
      path: "/color",
      name: "color",
      component: () => import("../components/color/color")
    },
    {
      path: "/link",
      name: "link",
      component: () => import("../components/link/link")
    },
    {
      path: "/jump",
      name: "jump",
      component: () => import("../components/jump/jump")
    },
    {
      path: "/picross",
      name: "picross",
      component: () => import("../components/picross/picross")
    },
    {
      path: "/digital",
      name: "digital",
      component: () => import("../components/digital/digital")
    },
    {
      path: "/wolf",
      name: "wolf",
      component: () => import("../components/wolf/wolf")
    },
    {
      path: "/graduate",
      name: "graduate",
      component: () => import('../components/graduate/graduate')
    },
    {
      path: "/eco",
      name: "eco",
      component: () => import("../components/eco/eco")
    },
    {
      path: "/cssDraw",
      name: "cssDraw",
      component: () => import("../components/cssDraw/cssDraw")
    },
    {
      path: "/tripleDisaster",
      name: "tripleDisaster",
      component: () => import("../components/tripleDisaster/tripleDisaster")
    },
    {
      path: "/ccc",
      name: "ccc",
      component: () => import("../components/ccc/ccc")
    },
    {
      path: "/magicCube",
      name: "magicCube",
      component: () => import("../components/magicCube/magicCube")
    },
    {
      path: "/gangEditor",
      name: "gangEditor",
      component: () => import('../components/gangEditor/gangEditor')
    },
    {
      path: "/gangCompany",
      name: "gangCompany",
      component: () => import('../components/gangCompany/gangCompany')
    },
  ]
})

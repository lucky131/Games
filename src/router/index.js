import Vue from 'vue'
import Router from 'vue-router'

import menu from "../components/gameMenu"
import minesweeper from "../components/minesweeper/minesweeper"
import snake from "../components/snake/snake"
import color from "../components/color/color"
import jump from "../components/jump/jump"
import link from "../components/link/link"
import picross from "../components/picross/picross"

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
      component: minesweeper
    },
    {
      path: "/snake",
      name: "snake",
      component: snake
    },
    {
      path: "/color",
      name: "color",
      component: color
    },
    {
      path: "/link",
      name: "link",
      component: link
    },
    {
      path: "/jump",
      name: "jump",
      component: jump
    },
    {
      path: "/picross",
      name: "picross",
      component: picross
    }
  ]
})

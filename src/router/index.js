import Vue from 'vue'
import Router from 'vue-router'

import menu from "@/components/gameMenu.vue"
import minesweeper from "@/components/minesweeper/minesweeper.vue"
import snake from "@/components/snake/snake.vue"
import color from "@/components/color/color.vue"
import jump from "@/components/jump/jump.vue"
import link from "@/components/link/link.vue"

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
    }
  ]
})

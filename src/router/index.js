import { createRouter, createWebHashHistory } from 'vue-router'
import Homepage from '../views/Homepage.vue'
import SavedSearches from '../views/SavedSearches.vue'
import SearchResults from '../views/SearchResults.vue'

const routes = [
  {
    path: '/',
    redirect: '/homepage'
  },
  {
    path: '/homepage',
    name: 'Homepage',
    component: Homepage
  },
  {
    path: '/saved-searches',
    name: 'SavedSearches',
    component: SavedSearches
  },
  {
    path: '/search',
    name: 'SearchResults',
    component: SearchResults
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router


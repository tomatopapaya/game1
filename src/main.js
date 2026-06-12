import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { createStore } from 'vuex'
import router from './router'

const store = createStore({
    state(){
        return{
            author: 'danny',
            likes: 0,
            score: 0    
        }
    },
    mutations: {
        increaseLike(state){
            state.likes++
        },
        updateScore(state, score){
            state.score += score
        },
        resetScore(state){
            state.score = 0
        }
    }
})

const app = createApp(App)
app.use(store)
app.use(router)
app.mount('#app')

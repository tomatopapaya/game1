<template>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <div style="font-size: 30px; font-weight: bold;">Power by {{ $store.state.author }}</div>
    <div style="font-size: 30px; font-weight: bold;">Score : {{ $store.state.score  }}</div>
    <div v-show="isplaying" style="position: absolute; top: 20px; left: 770px; font-size: 24px; font-weight: bold;">
        {{ timeLeft }}s
    </div>
    <div class="control-area">
        <button class="control-btn left-btn" @pointerdown="startMoveByButton('left')" @pointerup="stopMoveByButton('left')" @pointerleave="stopMoveByButton('left')" @pointercancel="stopMoveByButton('left')">◀</button>
    </div>
    <div class="control-area" style="left: 740px;">
        <button class="control-btn right-btn" @pointerdown="startMoveByButton('right')" @pointerup="stopMoveByButton('right')" @pointerleave="stopMoveByButton('right')" @pointercancel="stopMoveByButton('right')">▶</button>
    </div>
    <br>
    <img v-show="!isplaying" @click="startGame" :src="`${base}startbutton.png`" alt="Image" style="width: 70px; height: auto; margin-top: 20px;">
    <div v-show="isplaying" v-for="item in items" :key="item.name" :style="{ position: 'absolute', left: item.x + 'px', top: item.y + 'px' }">
        <img :src="`${base}${item.name}.png`" alt="Image" style="width: 40px; height: auto;">
    </div>
    <img v-show="isCounting" :src="`${base}count${countFrame}.png`" :style="{ width: '70px', height: '80px', position: 'absolute', top: '150px', left: '390px' }">
    <img v-show="isover" :src="`${base}timeover.png`" :style="{ width: '270px', height: '150px', position: 'absolute', top: '150px', left: '300px' }">
    <img :src="`${base}player${playerFrame}.png`" :style="{ width: widthX + 'px', height: '92px', position: 'absolute', top: '372px', left: playerX + 'px', transform: playerDirection === 'right' ? 'scaleX(-1)' : 'scaleX(1)' }">
</template>

<script lang="js">

import { defineComponent, ref  } from 'vue'


export default defineComponent({

    data() {
        return {
            base: import.meta.env.BASE_URL,
            intervals: [],
            isplaying: false,
            isCounting: false,
            isover: false,
            widthX: 60,
            playerX: 520,
            playerSpeed: 20,
            playerFrame: '',
            countFrame: 1,
            walkInterval: null,
            isMoving: false,
            playerDirection: 'left',
            keysPressed: {},
            timeLeft: 30,
            timerInterval: null,
            moveInterval: null,
            buttonDirection: ''
        }
    },

    setup() {
        const items = ref([
            { name: 'red_Maple', x: Math.random() *
                            (820 - 100), y: 0, value: 10, speed: 10 },
            { name: 'gold_Maple', x: Math.random() *
                            (820 - 100), y: 0, value: 50, speed: 20 },
            { name: 'bomb', x: Math.random() *
                            (820 - 100), y: 0, value: -300, speed: 15 }
        ])

        return { items }
    },

    mounted() {
        window.addEventListener('keydown', this.handleKeydown)
        window.addEventListener('keyup', this.handleKeyup)
    },

     beforeUnmount() {
        window.removeEventListener('keydown', this.handleKeydown)    
        window.removeEventListener('keyup', this.handleKeyup) 
        this.stopMoving()
    },

    methods: {
        handleKeydown(event) {
            if (event.key === 'ArrowLeft') {
                if (this.keysPressed[event.key]) return
                this.keysPressed[event.key] = true
                this.playerDirection = 'left'
                this.widthX = 75
                this.startWalkAnimation()
                this.startMoving()
            } else if (event.key === 'ArrowRight') {
                if (this.keysPressed[event.key]) return
                this.keysPressed[event.key] = true
                this.playerDirection = 'right'
                this.widthX = 75
                this.startWalkAnimation()
                this.startMoving()
            }
        },

        handleKeyup(event) {
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                this.keysPressed[event.key] = false
                this.widthX = 60
                this.stopWalkAnimation()
                this.stopMoving()
            }   
        },

        startMoveByButton(direction) {
            if (!this.isplaying) return
            this.buttonDirection = direction
            this.playerDirection = direction
            this.widthX = 75
            this.startWalkAnimation()
            this.startMoving()
        },

        stopMoveByButton(direction) {
            if (this.buttonDirection !== direction) return
            this.buttonDirection = ''
            this.widthX = 60
            this.stopWalkAnimation()
            this.stopMoving()
        },

        async startGame() {
            await this.startCount()
            this.$store.commit('resetScore')
            this.isover = false
            this.isplaying = true
            this.timeLeft = 30
            this.timerInterval = setInterval(() => {
            this.timeLeft--
            if (this.timeLeft <= 0) {
                clearInterval(this.timerInterval)
                this.timerInterval = null
            }
            }, 1000)

            this.items.forEach(item => {
                const interval = setInterval(() => {

                    const playerTop = 372
                    const playerBottom = playerTop + 92
                    const playerLeft = this.playerX
                    const playerRight = this.playerX + this.widthX

                    const itemLeft = item.x
                    const itemRight = item.x + 40
                    const itemTop = item.y
                    const itemBottom = item.y + 40

                    const isColliding =
                    itemRight > playerLeft &&
                    itemLeft < playerRight &&
                    itemBottom > playerTop &&
                    itemTop < playerBottom

                    if (isColliding) {
                        this.$store.commit('updateScore', item.value)
                        item.y = 0
                        item.x =
                            Math.random() *
                            (820 - 100)
                        return
                    }

                    item.y += item.speed

                    if (item.y > 485-50) {

                        item.y = 0

                        item.x =
                            Math.random() *
                            (820 - 100)
                    }

                }, 100)

                this.intervals.push(interval)

            })

            setTimeout(() => {
                this.intervals.forEach(interval => clearInterval(interval))
                this.intervals = []
                this.isplaying = false
                this.isover = true
                clearInterval(this.timerInterval)
                this.timerInterval = null
            }, 30000)
        },

        startWalkAnimation() {
            if (this.isMoving) return
            this.playerFrame = 1
            this.isMoving = true
            this.walkInterval = setInterval(() => {
                this.playerFrame = (this.playerFrame % 5) + 1
            }, 140)  
        },

        stopWalkAnimation() {
            clearInterval(this.walkInterval)
            this.walkInterval = null
            this.isMoving = false
            this.playerFrame = '' 
            this.widthX = 60
        },

        startMoving(){
            if(this.moveInterval) return
            this.moveInterval = setInterval(() => {
                if (this.playerDirection === 'left') {
                    this.playerX = Math.max(0, this.playerX - this.playerSpeed)
                } 
                else {
                    this.playerX = Math.min(820 - this.widthX, this.playerX + this.playerSpeed)
                }   
            }, 90)
        },  

        stopMoving() {
            clearInterval(this.moveInterval)
            this.moveInterval = null
        },


        startCount() {
            this.isover = false
            this.isCounting = true
            return new Promise((resolve) => {
                this.countFrame = 1
                const tick = () => {
                    if (this.countFrame < 3) {
                        this.countFrame++
                        setTimeout(tick, 1000)
                    } else {
                        this.isCounting = false
                        resolve()  // 倒數結束
                    }
                }
                setTimeout(tick, 1000)
            })
        },
    }
})
</script>

<style scoped>
.control-area {
    position: absolute;
    bottom: 20px;
    left: 20px;
    display: flex;
    gap: 16px;
    z-index: 5;
}

.control-btn {
    width: 56px;
    height: 56px;
    border: none;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.9);
    color: #333;
    font-size: 24px;
    font-weight: bold;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.25);
    touch-action: none;
    user-select: none;
}

.control-btn:active {
    transform: scale(0.96);
}
</style>
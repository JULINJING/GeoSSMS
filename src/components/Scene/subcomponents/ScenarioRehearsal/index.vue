<template>
  <div class="dark">
    <div id="viewReset" class="infoview" style="overflow: auto; top: 10px">
      <div class="btn-group">
        <button id="btn_md" type="button" class="btn btn-primary btn-mb" v-if="!isPlay || isPause" @click="play"><i class="fa fa-play-circle-o"></i>{{ isPause ? "继续" : "开始" }}</button>
        <button id="btn_pause" type="button" class="btn btn-primary btn-right5 btn-mb" style="display: none" v-if="isPlay && !isPause" @click="pause"><i
            class="fa fa-pause-circle-o"></i>暂停</button>
        <button id="btn_stop" type="button" class="btn btn-primary btn-mb" style="display: none" v-if="isPlay" @click="stop"><i
            class="fa fa-stopFun-circle-o"></i>停止</button>
      </div>
    </div>
  </div>
</template>





<script setup>

import * as mars3d from "mars3d";
const Cesium = mars3d.Cesium


import { ref, onMounted } from "vue"
import * as mapWork from "./map.js"
const isPlay = ref(false)
const isPause = ref(false)
const totalTimes = ref("")
const selectedKeys = ref<[]>([])
const counter = ref(0)
const currentIndex = ref(0)
let timer = null
let interval = null
const animations = []
const currentWork = ref("")
const showPause = ref(true)

onMounted(() => {
  let i = 0
  let time = 0
  treeData.forEach((item) => {
    const animationItem = item
    animationItem.index = i
    time += item.times
    i++
    animations.push(animationItem)
  })
  mapWork.addGraphics()
  totalTimes.value = `${Math.floor(time / 60)}分${time % 60}秒`
})

function play() {
  isPlay.value = true
  console.log(isPlay.value)
  isPause.value = false
  start()
}
function pause() {
  clearTimeout(timer)
  currentIndex.value--
  isPause.value = true
}

function stop() {
  isPlay.value = false
  isPause.value = false

  if (timer) {
    clearTimeout(timer)
  }
  if (interval) {
    clearInterval(interval)
  }

  counter.value = 0
  currentIndex.value = 0
  timer = null
  interval = null
  currentWork.value = ""
  mapWork.stop()
}

const startBegin = () => {
  currentIndex.value = item.index
  play()
}

const start = () => {
  if (timer) {
    clearTimeout(timer)
  }
  if (interval) {
    clearInterval(interval)
  }

  if (currentIndex.value < animations.length) {
    const animate = animations[currentIndex.value]
    selectedKeys.value = [animate.key]
    currentWork.value = `${animate.title}(${animate.times}秒)`
    counter.value = animate.times
    countOn()
    animate.widget()
    currentIndex.value++
    timer = setTimeout(() => {
      start()
    }, animate.times * 1000)
  } else {
    stop()
  }
}

const treeData = [
  {
    title: "发送信号",
    key: "01",
    times: 5,
    widget() {
      mapWork.firstStep()
    }
  },
  {
    title: "传送信号",
    key: "02",
    times: 5,
    widget() {
      mapWork.secondStep()
    }
  },
  {
    title: "下达指令",
    key: "03",
    times: 5,
    widget() {
      mapWork.thirdStep()
    }
  },
  {
    title: "准备出发",
    key: "04",
    times: 5,
    widget() {
      mapWork.forthStep()
    }
  },
  {
    title: "出发",
    key: "05",
    times: 7,
    widget() {
      mapWork.fifthStep()
    }
  },
  {
    title: "处理泄露",
    key: "06",
    times: 5,
    widget() {
      mapWork.sixthStep()
    }
  },
  {
    title: "完成营救",
    key: "07",
    times: 4,
    widget() {
      mapWork.seventhStep()
    }
  }
]

function countOn() {
  interval = setInterval(() => {
    counter.value--
    if (counter.value <= 0) {
      clearInterval(interval)
    }
  }, 1000)
}
</script>

<style scoped>
.viewResult {
  top: 10px;
  left: 10px;
  bottom: auto;
  right: auto;
  max-width: 420px;
  overflow: auto;
  font-size: 28px;
}

.contentUl {
  padding: 0;
  text-align: left;
  font-size: 20px;
  margin-left: 10px;
}

.btn i {
  margin-right: 5px;
}

.btn-right5 {
  margin-right: 5px;
}

/**************** seaRescue示例中的蓝黑面板 ****************/
.marsBlueBlack {
  width: 150px;
  position: absolute;
  left: 16px;
  bottom: 31px;
  cursor: default;
  opacity: 0.96;
  border: 1px solid #00b6ff;
  box-shadow: 0px 2px 21px 0px rgba(33, 34, 39, 0.55);
  box-sizing: border-box;
}
.marsBlueBlack::before {
  content: "";
  width: calc(100% + 22px);
  height: 39px;
  position: absolute;
  bottom: -39px;
  left: -22px;
  background: url("@/../public/imgs/icon/popupLbl.png") 0px 0px no-repeat;
  background-position: 0px 0px;
}

.marsBlueBlack .marsBlueBlack-top {
  background-color: #198eff;
  font-size: 16px;
  padding:6px;
}

.marsBlueBlack .marsBlueBlack-down {
  background-color: black;
  font-size: 12px;
  padding:3px
}



.btn-mb {
  margin-bottom: 10px;
}


</style>

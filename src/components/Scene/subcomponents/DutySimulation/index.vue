<template>
  <div class="infoview" id="simulationInfoWindow">
    <div class="panel">
      <h5>1 哨塔巡航</h5>
      <div class="flex-container">
        <div class="sequence-info">
          <div>序号</div>
          <div>1</div>
          <div>2</div>
          <div>3</div>
          <div>4</div>
        </div>

        <div class="point-info">
          <div>地点</div>
          <div>哨塔A</div>
          <div>哨塔B</div>
          <div>哨塔C</div>
          <div>哨塔D</div>
        </div>

        <div class="button-group">
          <el-button icon="el-icon-video-play" circle @click="addTowerGraphicLayer"></el-button>
          <el-button icon="el-icon-video-pause" circle @click="towerCruisePause"></el-button>
        </div>
      </div>
    </div>

    <div class="panel">
      <h5>2 地面巡航</h5>
      <div class="flex-container">
        <div class="sequence-info">
          <div>序号</div>
          <div>1</div>
          <div>2</div>
          <div>3</div>
        </div>

        <div class="point-info">
          <div>地点</div>
          <div>地面点A</div>
          <div>地面点B</div>
          <div>地面点C</div>
        </div>
        <div style="display: flex;flex-direction: column;gap:20px">
          <el-button round @click="this.$parent.controlCha">自主巡航</el-button>
          <div class="button-group">
            <el-button icon="el-icon-video-play" circle @click="addPersonGraphicLayer"></el-button>
            <el-button icon="el-icon-video-pause" circle @click="personCruisePause"></el-button>
          </div>
        </div>
      </div>
    </div>

    <div class="panel">
      <h5>3 空中巡航</h5>
      <div class="flex-container">
        <div class="sequence-info">
          <div>序号</div>
          <div>1</div>
          <div>2</div>
          <div>3</div>
          <div>4</div>
          <div>5</div>
        </div>

        <div class="point-info">
          <div>地点</div>
          <div>空中点1</div>
          <div>空中点2</div>
          <div>空中点3</div>
          <div>空中点4</div>
          <div>空中点5</div>
        </div>

        <div class="button-group">
          <el-button icon="el-icon-video-play" circle @click="airCruiseStart"></el-button>
          <el-button icon="el-icon-video-pause" circle @click="airCruisePause"></el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as mars3d from "mars3d"
const Cesium = mars3d.Cesium

export default {
  data() {
    return {
      fixedRoute1: null,
      fixedRoute2: null,
      isAirPaused: false,
      isPersonPaused: false
    }
  },
  created(){
  },
  computed:{
  },
  methods: {
    // 空中巡航
    airCruiseStart() {
      mars3d.Util.fetchJson({ url: "../../../../data/route.json" })
          .then((arr)=> {
            const arrNew = []
            for (let i = 0; i < arr.length; i++) {
              const point = arr[i]
              arrNew.push({
                lng: point.lng,
                lat: point.lat,
                alt: point.height,
                heading: point.aircraftYaw || 0,
                pitch: point.gimbalPitch || 0
              })
            }
            this.addAirGraphicLayer(arrNew)
          })
          .catch(function (error) {
            console.log("加载JSON出错", error)
          })
    },
    addAirGraphicLayer(arr) {
      if (this.isAirPaused) {
        this.fixedRoute1.proceed()
        this.isAirPaused = false
      } else {
        // 创建矢量数据图层
        const graphicLayer = new mars3d.layer.GraphicLayer({id:'graphicLayer1'})
        this.map.addLayer(graphicLayer)

        for (let i = 0; i < arr.length; i++) {
          const graphic = new mars3d.graphic.LabelPrimitive({
            position: arr[i],
            style: {
              text: i,
              font_size: 14
            }
          })
          graphicLayer.addGraphic(graphic)
        }

        this.fixedRoute1 = new mars3d.graphic.FixedRoute({
          name: "飞机航线",
          speed: 100,
          positions: arr,
          model: {
            url: "//data.mars3d.cn/gltf/mars/dajiang/dajiang.gltf",
            scale: 1,
            minimumPixelSize: 100,
            pitch: 0 // 固定角度
          },
          path: {
            color: "rgba(255,0,0,0.6)",
            width: 1,
            leadTime: 0
          }
        })
        graphicLayer.addGraphic(this.fixedRoute1)

        // 绑定popup
        this.fixedRoute1.bindPopup(
            `<div style="width: 200px">
                    <div>总 距 离：<span id="lblAllLen"> </span></div>
                    <div>开始时间：<span id="lblStartTime"> </span></div>
                    <div>剩余距离：<span id="lblRemainLen"> </span></div>
                    </div>`,
            { closeOnClick: false }
        )

        // 刷新局部DOM,不影响popup面板的其他控件操作
        this.fixedRoute1.on(mars3d.EventType.postRender, function (event) {
          const container = event.container // popup对应的DOM

          const params = this.fixedRoute1?.info
          if (!params) {
            return
          }

          const lblAllLen = container.querySelector("#lblAllLen")
          if (lblAllLen) {
            lblAllLen.innerHTML = mars3d.MeasureUtil.formatDistance(params.distance_all)
          }

          const lblStartTime = container.querySelector("#lblStartTime")
          if (lblStartTime) {
            lblStartTime.innerHTML = mars3d.Util.formatDate(Cesium.JulianDate.toDate(this.fixedRoute1.startTime), "yyyy-M-d HH:mm:ss")
          }

          const lblRemainLen = container.querySelector("#lblRemainLen")
          if (lblRemainLen) {
            lblRemainLen.innerHTML = mars3d.MeasureUtil.formatDistance(params.distance_all - params.distance) || "完成"
          }
        })

        this.fixedRoute1.start()

        const graphic = new mars3d.graphic.CylinderPrimitive({
          position: new Cesium.CallbackProperty((time) => {
            return this.fixedRoute1.position
          }, false),
          style: {
            length: 200,
            topRadius: 0.0,
            bottomRadius: 200,
            materialType: mars3d.MaterialType.CircleWave,
            materialOptions: {
              color: "#fff"
            }
          }
        })
        graphicLayer.addGraphic(graphic)
      }
    },
    airCruisePause() {
      this.fixedRoute1.pause()
      this.isAirPaused = true
    },
    // 地面巡航
    addPersonGraphicLayer() {
      if (this.isPersonPaused) {
        this.fixedRoute2.proceed()
        this.isPersonPaused = false
      } else {
        // 创建矢量数据图层
        const graphicLayer = new mars3d.layer.GraphicLayer({id:'graphicLayer2'})
        this.map.addLayer(graphicLayer)

        this.fixedRoute2 = new mars3d.graphic.FixedRoute({
          name: "步行路线",
          frameRate: 1,
          speed: 40,
          // autoStop: true, // 到达终点自动停止
          clockLoop: true, // 循环播放
          positions: [
            [101.30063, 37.99896, 2978.5],
            [101.299528, 37.998654, 2987],
            [101.300666, 37.99598, 2974.3],
            [101.299317, 37.995536, 2978.9],
            [101.29819, 37.998228, 2996.3],
            [101.296895, 37.997904, 2996]
          ],
          pauseTime: 0.5,
          camera: {
            type: "gs",
            radius: 300
          },
          model: {
            url: "//data.mars3d.cn/gltf/mars/man/walk.gltf",
            scale: 5,
            minimumPixelSize: 50,
            clampToGround: true
          },
          circle: {
            radius: 10,
            materialType: mars3d.MaterialType.CircleWave,
            materialOptions: {
              color: "#ffff00",
              opacity: 0.3,
              speed: 10,
              count: 3,
              gradient: 0.1
            },
            clampToGround: true
          }
        })
        graphicLayer.addGraphic(this.fixedRoute2)
        this.fixedRoute2.start()
      }
    },
    personCruisePause() {
      this.fixedRoute2.pause()
      this.isPersonPaused = true
    },
    // 哨塔巡航
    addTowerGraphicLayer() {
      // 创建矢量数据图层
      const graphicLayer = new mars3d.layer.GraphicLayer({id:'graphicLayer3'})
      this.map.addLayer(graphicLayer)
      const positions = [
        [101.300796, 37.999163, 3000],
        [101.296669, 37.997987, 3000],
        [101.298, 37.995056, 3000],
        [101.30213, 37.996232, 3000],
        [101.300796, 37.999163, 3000]
      ]

      const graphic = new mars3d.graphic.WallEntity({
        positions: mars3d.PolyUtil.interLine(positions, { minDistance: "auto" }), // 切分坐标，使流动材质均匀些
        style: {
          diffHeight: 35,
          materialType: mars3d.MaterialType.LineFlow,
          materialOptions: {
            // 动画线材质
            image: "../../imgs/arrow.png",
            color: "#00eba8",
            repeat: new Cesium.Cartesian2(20, 1),
            speed: 20
          }
        }
      })
      graphicLayer.addGraphic(graphic)
    },
    towerCruisePause() {
      this.map.getLayerById('graphicLayer3').remove(true)
    },
  },
}
</script>
<style scoped>
#simulationInfoWindow {
  overflow: auto;
  max-height: 620px;
  width: 400px;
  position: absolute;
  left: 50px;
  top: 60px;
  display: flex;
  flex-direction: column;
  gap: 8px; /* 设置面板之间的距离 */
}

.panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.flex-container {
  display: flex;
  align-items: center; /* 使元素垂直居中 */
  gap: 20px; /* 用于设置元素之间的距离 */
  justify-content: space-around;
}

.sequence-info, .point-info {
  display: flex;
  flex-direction: column;
  align-items: center; /* 使文本垂直居中 */
  gap: 5px;
}

.button-group {
  display: flex;
  gap: 10px;  /* 按钮之间的距离 */
}

</style>

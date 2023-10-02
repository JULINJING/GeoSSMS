<template>
  <div class="infoview" style="overflow: auto; max-height: 850px; width:240px; top:60px;right:320px;"
    id="cameraInfoWindow">
    <h3 style="text-align: center; font-size: 24px; color: rgb(94, 159, 250);">分析功能</h3>
    <table class="mars-table">
      <tbody>
        <tr v-for="analysisObj in analysisArray">
          <div @click="analysisObj.func" class="analysis">
            <img :src="'/imgs/analysis/' + analysisObj.imgName" style="width: 100%; height: 100px; margin-bottom: 5px;" />
            <h3 style="text-align: center; font-size: 16px; margin-bottom: 5px;">{{ analysisObj.name }}</h3>
          </div>
        </tr>
      </tbody>
    </table>
    <div style="position: relative;">
      <el-button id="clear" @click="clearAll">清空</el-button>
    </div>

  </div>
</template>

<script>
import 'mars3d/dist/mars3d.css'
import * as mars3d from 'mars3d'

export default {
  name: "Analysis",
  data() {
    const buildingPostion = [new mars3d.LngLatPoint(101.304507, 37.994788, 2953), new mars3d.LngLatPoint(101.30185, 38.001296, 2977.8), new mars3d.LngLatPoint(101.294362, 37.998878, 3029.7), new mars3d.LngLatPoint(101.297263, 37.992794, 2968.9)]
    const slope = new mars3d.thing.Slope({
      arrow: {
        scale: 0.3, // 箭头长度的比例（范围0.1-0.9）
        color: Cesium.Color.YELLOW,
        width: 15, // 箭头宽度
        show: true
      },
      tooltip: function (event) {
        const attr = event.graphic?.attr
        return `坡度: ${attr.slopeStr1}  (${attr.slopeStr2})<br />坡向: ${attr.direction}°`
      }
    })

    const contourLine = new mars3d.thing.ContourLine({
      contourShow: false, // 是否显示等高线
      shadingType: "none", // 地表渲染效果类型:无nono, 高程 elevation, 坡度slope, 坡向aspect
      shadingAlpha: 0.6, /// 地表渲染的透明度
      colorScheme: {
        // 地表渲染的配色方案
        elevation: {
          step: [0.0, 0.045, 0.1, 0.15, 0.37, 0.54, 1.0],
          color: ["#000000", "#2747E0", "#D33B7D", "#D33038", "#FF9742", "#FF9742", "#ffd700"]
        },
        slope: {
          step: [0.0, 0.29, 0.5, Math.sqrt(2) / 2, 0.87, 0.91, 1.0],
          color: ["#000000", "#2747E0", "#D33B7D", "#D33038", "#FF9742", "#FF9742", "#ffd700"]
        },
        aspect: {
          step: [0.0, 0.2, 0.4, 0.6, 0.8, 0.9, 1.0],
          color: ["#000000", "#2747E0", "#D33B7D", "#D33038", "#FF9742", "#FF9742", "#ffd700"]
        }
      },
    })

    const floodByMaterial = new mars3d.thing.FloodByMaterial({
      color: "rgba(0, 123, 230, 0.5)" // 淹没颜色
    })

    const sightline = new mars3d.thing.Sightline({
      visibleColor: new Cesium.Color(0, 1, 0, 0.4),
      hiddenColor: new Cesium.Color(1, 0, 0, 0.4)
      // depthFailColor: Cesium.Color.fromCssColorString("#db2c8f"),
    })

    const analysisArray = [
      {
        id: 1,
        name: "坡度分析",
        imgName: "slope.png",
        func: this.slopeAnalysis
      },
      {
        id: 2,
        name: "等高线分析",
        imgName: "heightLine.png",
        func: this.heightLineAnalysis
      },
      {
        id: 3,
        name: "淹没分析",
        imgName: "inundation.png",
        func: this.inundationAnalysis
      },
      {
        id: 4,
        name: "通视分析",
        imgName: "visibility.png",
        func: this.visibilityAnalysis
      },
    ]

    return {
      buildingPostion,
      slope,
      contourLine,
      floodByMaterial,
      sightline,
      analysisArray,
      isInit: false,
    }
  },
  methods: {
    initAnalysis() {
      console.log("初始化", this.map.graphicLayer)
      this.map.addThing(this.contourLine)
      this.map.addThing(this.slope)
      this.map.addThing(this.floodByMaterial)
      this.map.addThing(this.sightline)
      this.slope.on(mars3d.EventType.end, function (e) {
        console.log("分析完成", e)
      })
      this.floodByMaterial.on(mars3d.EventType.end, function (e) {
        console.log("分析完成", e)
      })
      console.log("初始化完成")
      this.isInit = true
    },

    // 坡度坡向分析
    slopeAnalysis() {
      if (!this.isInit) {
        this.initAnalysis()
      }
      this.clearAll();
      console.log("开始分析")
      this.contourLine = new mars3d.thing.ContourLine({
        contourShow: false, // 是否显示等高线
        shadingType: "slope", // 地表渲染效果类型:无nono, 高程 elevation, 坡度slope, 坡向aspect
        shadingAlpha: 0.6, /// 地表渲染的透明度
        positions: this.buildingPostion,
        colorScheme: {
          // 地表渲染的配色方案
          elevation: {
            step: [0.0, 0.045, 0.1, 0.15, 0.37, 0.54, 1.0],
            color: ["#000000", "#2747E0", "#D33B7D", "#D33038", "#FF9742", "#FF9742", "#ffd700"]
          },
          slope: {
            step: [0.0, 0.29, 0.5, Math.sqrt(2) / 2, 0.87, 0.91, 1.0],
            color: ["#000000", "#2747E0", "#D33B7D", "#D33038", "#FF9742", "#FF9742", "#ffd700"]
          },
          aspect: {
            step: [0.0, 0.2, 0.4, 0.6, 0.8, 0.9, 1.0],
            color: ["#000000", "#2747E0", "#D33B7D", "#D33038", "#FF9742", "#FF9742", "#ffd700"]
          }
        },
      })
      this.map.addThing(this.contourLine)
      this.slope.add(this.buildingPostion, {
        splitNum: 10,
        radius: 1,
        count: 4,
      })
    },

    // 等高线分析
    heightLineAnalysis() {
      if (!this.isInit) {
        this.initAnalysis()
      }
      this.clearAll()
      console.log("等高线分析", this.buildingPostion)
      this.contourLine = new mars3d.thing.ContourLine({
        spacing: 5,
        width: 1.5,
        color: "rgba(255,0,0,0.8)",
        minHeight: -414.0,
        maxHeight: 8777.0,
        shadingAlpha: 0.6, /// 地表渲染的透明度
        shadingType: "slope",
        colorScheme: {
          // 地表渲染的配色方案
          elevation: {
            step: [0.0, 0.045, 0.1, 0.15, 0.37, 0.54, 1.0],
            color: ["#000000", "#2747E0", "#D33B7D", "#D33038", "#FF9742", "#FF9742", "#ffd700"]
          },
          slope: {
            step: [0.0, 0.29, 0.5, Math.sqrt(2) / 2, 0.87, 0.91, 1.0],
            color: ["#000000", "#2747E0", "#D33B7D", "#D33038", "#FF9742", "#FF9742", "#ffd700"]
          },
          aspect: {
            step: [0.0, 0.2, 0.4, 0.6, 0.8, 0.9, 1.0],
            color: ["#000000", "#2747E0", "#D33B7D", "#D33038", "#FF9742", "#FF9742", "#ffd700"]
          }
        }
      })
      this.map.addThing(this.contourLine)
      const area = this.contourLine.addArea(this.buildingPostion)
      console.log("结束", area)
      this.contourShow = true;
    },

    // 淹没分析
    inundationAnalysis() {
      if (!this.isInit) {
        this.initAnalysis()
      }
      this.clearAll()
      const cartesianBuildingPosition = this.buildingPostion.map((bdp) => mars3d.LngLatPoint.toCartesian(bdp))
      this.floodByMaterial.addArea(cartesianBuildingPosition)
      this.floodByMaterial.setOptions({
        minHeight: 2953,
        maxHeight: 3029.7,
        speed: 8
      })
      this.floodByMaterial.start()
      // mars3d.PolyUtil.interPolygonByDepth({ scene: this.map.scene, position: cartesianBuildingPosition }).then((result) => {
      //   console.log("开始分析")
      //   const minHeight = Math.ceil(result.minHeight)
      //   const maxHeight = Math.floor(result.maxHeight)
      //   this.floodByMaterial.setOptions({
      //     minHeight,
      //     maxHeight,
      //     speed: 1
      //   })
      //   this.floodByMaterial.start()
      // })
    },

    // 通视分析
    createPoint(position, isFirst) {
      const graphic = new mars3d.graphic.PointEntity({
        position: position,
        style: {
          color: Cesium.Color.fromCssColorString("#3388ff"),
          pixelSize: 6,
          outlineColor: Cesium.Color.fromCssColorString("#ffffff"),
          outlineWidth: 2,
          scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 8.0e6, 0.2),
          label: {
            text: isFirst ? "观察位置" : "目标点",
            font_size: 17,
            font_family: "楷体",
            color: Cesium.Color.AZURE,
            outline: true,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -20), // 偏移量
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 2000000)
          }
        }
      })
      this.map.graphicLayer.addGraphic(graphic)

      return graphic
    },
    visibilityAnalysis() {
      if (!this.isInit) {
        this.initAnalysis()
      }
      this.clearAll()
      this.map.graphicLayer.startDraw({
        type: "polyline",
        maxPointNum: 2,
        style: {
          color: "#55ff33",
          width: 3
        },
        success: (graphic) => {
          // 绘制成功后回调
          const positions = graphic.positionsShow
          this.map.graphicLayer.clear()
          this.map.scene.globe.depthTestAgainstTerrain = true

          const center = positions[0]
          const targetPoint = positions[1]
          this.sightline.add(center, targetPoint, { offsetHeight: 1.8 }) // 1.5是加人的身高等因素，略微抬高一些

          this.createPoint(center, true)
          this.createPoint(targetPoint, false)

          this.map.scene.globe.depthTestAgainstTerrain = false
        }
      })
    },

    // 可视域分析
    // visibleRangeAnalysis() {
    //   this.clearAll()
    //   // this.graphicLayer.startDraw({
    //   //   type: "viewShed",
    //   //   style: {
    //   //     angle: 60,
    //   //     angle2: 45,
    //   //     distance: 80,
    //   //     heading: 44,
    //   //     pitch: -12,
    //   //     addHeight: 0.5 // 在坐标点增加的高度值，规避遮挡，效果更友好
    //   //   }
    //   // })
    // },

    // 清除
    clearAll() {
      this.slope.clear()
      this.contourLine.clear()
      this.floodByMaterial.clear()
      this.sightline.clear()
      this.map.graphicLayer.clear()
    }

  },
  mounted() {
    console.log("analysis组件挂载")
  }
}

</script>

<style>
#mainboard {
  position: absolute;
  z-index: 1000;
  top: 100px;
  right: 10px;
  width: 300px;
  height: 450px;
}

.analysis:hover {
  cursor: pointer;
  background-color: #bfc4cca2;
}

#clear {
  float: right;
  background-color: rgb(81, 135, 242)
}

#clear:hover {
  background-color: rgb(71, 105, 175)
}
</style>
<template>
  <div id="mainboard">
    <div style="color: yellow;">这是面板位置</div>
    <button @click="initAnalysis">初始化</button>
    <button @click="slopeAnalysis">坡度分析</button>
    <button @click="heightLineAnalysis">等高线分析</button>
    <button @click="inundationAnalysis">淹没分析</button>
    <button @click="clearAll">清空</button>
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

    return {
      buildingPostion,
      slope,
      contourLine,
      floodByMaterial,
      centerDialogVisible: false,
    }
  },
  methods: {
    initAnalysis() {
      console.log("初始化")
      this.map.addThing(this.contourLine)
      this.map.addThing(this.slope)
      this.map.addThing(this.floodByMaterial)
      this.slope.on(mars3d.EventType.end, function (e) {
        console.log("分析完成", e)
      })
      this.floodByMaterial.on(mars3d.EventType.end, function (e) {
        console.log("分析完成", e)
      })
    },
    // 坡度坡向分析
    slopeAnalysis() {
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
    // 等高线
    heightLineAnalysis() {
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
    // 淹没
    inundationAnalysis() {
      this.clearAll()
      const cartesianBuildingPosition = this.buildingPostion.map((bdp) => mars3d.LngLatPoint.toCartesian(bdp))
      this.floodByMaterial.addArea(cartesianBuildingPosition)
      this.floodByMaterial.setOptions({
        minHeight: 2953,
        maxHeight: 3029.7,
        speed: 4
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
    clearAll() {
      this.slope.clear()
      this.contourLine.clear()
      this.floodByMaterial.clear()
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
</style>
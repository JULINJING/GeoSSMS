<template>
  <div>
    <button @click="initAnalysis">初始化</button>
    <button @click="slopeAnalysis">坡度分析</button>
    <mars-dialog :visible="true" right="10" top="10">
      <div>我想要天上的月亮和地上的霜</div>
    </mars-dialog>
  </div>
</template>

<script>
import 'mars3d/dist/mars3d.css'
import * as mars3d from 'mars3d'

export default {
  name: "Analysis",
  data() {
    const buildingPostion = [new mars3d.LngLatPoint(101.307009, 38.00242, 2962.9), new mars3d.LngLatPoint(101.298813, 38.002449, 3002), new mars3d.LngLatPoint(101.298788, 37.995278, 2982.1), new mars3d.LngLatPoint(101.306806, 37.995294, 2950.7)]
    const slope = new mars3d.thing.Slope({
      arrow: {
        scale: 0.3, // 箭头长度的比例（范围0.1-0.9）
        color: Cesium.Color.YELLOW,
        width: 15, // 箭头宽度
        // materialType: mars3d.MaterialType.LineFlow,
        // materialOptions: {
        //   color: "#1a9850",
        //   image: "img/textures/line-arrow-right.png",
        //   speed: 10
        // },
        // clampToGround: true,
        show: true
      },
      tooltip: function (event) {
        const attr = event.graphic?.attr
        return `坡度: ${attr.slopeStr1}  (${attr.slopeStr2})<br />坡向: ${attr.direction}°`
      }
    })
    return {
      buildingPostion,
      slope,
      centerDialogVisible: false,
    }
  },
  methods: {
    initAnalysis() {
      this.addSlope()
    },
    // 坡度坡向分析
    addSlope() {
      this.map.addThing(this.slope)
      this.slope.on(mars3d.EventType.end, function (event) {
        console.log("分析完成", event)
      })
    },
    slopeAnalysis() {
      this.slope.clear()
      this.slope.add(this.buildingPostion, {
        splitNum: 10,
        radius: 1,
        count: 4,
      })
    }

  },
  mounted() {
    console.log("analysis组件挂载")
  }
}

</script>

<style></style>
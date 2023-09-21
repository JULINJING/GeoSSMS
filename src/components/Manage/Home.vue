<template>
  <div style="color: #666;font-size: 14px;">
    <div style="padding-bottom: 20px">
      <b>欢迎你！{{ user.nickname }}</b>
    </div>
    <el-card>
      Made By —— 珞珈壹佰叁
      <el-divider />
      <div style="padding: 15px 0; font-size: 18px">
        <b>项目目标：</b><br/>
        <p>
          <br>
          面向某地区WJ队伍的特殊场景JY管理信息系统多种需求，采用B/S架构，设计可根据使用者不同层级设定不同权限，可通过多种Web浏览器终端使用的平台系统。设计可管理基础数据、专题数据和三维模型数据，包括摄像头数据、激光光栅数据、振动仪数据、风动仪数据、人员数据、车辆数据、其它设备数据及建筑模型等的系统，以进行时空数据融合，为平台系统提供数据支撑，实现“多源异构数据汇聚、三维时空精细表达、WJ业务深度融合”；为JY管理系统提供计算、存取、通信、安全等基础设施，设施层依托WJ内部网络及服务器；充分考虑某地区WJ中队数据管理的业务需求。
        </p>

      </div>
    </el-card>
    <div style="height: 1px; background: #ddd; margin: 20px 0"/>
    <el-card>
    <el-row :gutter="30">
      <el-col :span="8">
        <div style="padding: 20px 0; font-size: 20px;margin-left: 35px"><b>GIS工程设计与开发前后端分离项目框架</b></div>
        <div class="m-10">
          <el-button type="primary" style="margin-left: 50px"><i class="el-icon-link"></i> <a style="color: #fff" href="https://github.com/BinwenWu/">Github主页</a></el-button>
          <el-button type="danger" style="margin-left: 120px"><i class="el-icon-link"></i> <a style="color: #fff;" href="https://gitee.com/wu-binwen123/">Gitee主页</a></el-button>
        </div>
        <img src="@/assets/images/github.png" alt="" style="margin: 10px 0;width: 220px">
        <img src="@/assets/images/gitee.png" alt="" style="margin: 10px 0;width: 220px">
      </el-col>
      <el-col :span="15">
        <div style="padding: 20px 0; font-size: 20px"><b>技术栈</b></div>
        <el-row>
          <el-col :span="8" style="line-height: 30px">
            <div><b>后端</b></div>
            <div>SpringBoot2</div>
            <div>Hutool</div>
            <div>Apache POI</div>
            <div>Lombok</div>
            <div>Mybatis/Mybatis-plus</div>
            <div>JWT</div>
          </el-col>
          <el-col :span="8" style="line-height: 30px">
            <b>前端</b>
            <div>Vue2</div>
            <div>Vue-Router</div>
            <div>VueX</div>
            <div>ElementUI</div>
            <div>Axios</div>
            <div>Echarts</div>
            <div>Mars3D</div>
            <div>Openlayers</div>
          </el-col>
          <el-col :span="8" style="line-height: 30px">
            <b>其他</b>
            <div>Redis</div>
            <div>GeoServer</div>
            <div>Docker</div>
            <div>Containerd</div>
            <div>Kubernetes</div>
          </el-col>

        </el-row>

      </el-col>
    </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Home",
  data() {
    return {
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {}
    }
  },
  created() {

  }
}
</script>

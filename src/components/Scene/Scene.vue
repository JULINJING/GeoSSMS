<template>
    <div id="centerDiv" class="mapcontainer">
        <div class="page-overlay">
            <h3 class="animated_text">G e o S S M S</h3>
            <h2 id="teamName" class="schoolTitle opacity0" style="color: white;font-weight: 800;margin-top: 20px;">
                武汉大学遥感信息工程学院</h2>
            <h2 id="teamName" class="title opacity0" style="color: white;font-weight: 800;margin-top: 20px;">珞珈壹佰叁</h2>
            <div class="logo-list opacity0"><img src="./imgs/logo.png" height="120"></div>
        </div>

        <div id="PC">
            <div id="nav-bar" class="bottom-nav">
                <div v-for="item in navItems" :key="item.id" class="nav-item" @click="clickItem(item.id)"
                    @mouseover="hoverItem(item.id)" @mouseout="unhoverItem(item.id)">
                    <img :src="activeId === item.id ? item.activeIcon : item.icon" class="nav-icon" />
                    <h3 style="text-align: center;color: #f1f1f1;font-size: 1.2rem;font-weight: bold;">{{ item.title }}</h3>
                </div>
            </div>
            <Layout />
            <mars-map :url="configUrl" @onload="onMapload" :options="mapOptions" />
            <Analysis v-show="analysisVisible" />
            <div id="leftBar" class="sideBar left opacity0">
                <i id="leftClickSpan" class="iconfont opration-handler" aria-hidden="true"
                    @click="hideLeftPanel">&#xe653;</i>
                <div class="bar-content bar-content-left" id="leftContent">
                    <div class="chartbox">
                        <h5>建筑状态</h5>

                        <div id="weather1" style="overflow: scroll;" class="table-wrapper">
                            <el-table :data="buildInfo">
                                <el-table-column width="85px" prop="name" label="名称" />
                                <el-table-column width="45px" prop="status" label="状态" />
                                <el-table-column width="45px" prop="pop" label="人数" />
                                <el-table-column width="95px" prop="prop" label="性质" />

                            </el-table>

                        </div>
                    </div>
                    <div class="chartbox">
                        <h5>异常信息</h5>
                        <div id="weather2" style="overflow: scroll;" class="table-wrapper">
                            <el-table :data="warnInfo">
                                <el-table-column width="70px" prop="name" label="名称" />
                                <el-table-column width="65px" prop="type" label="类型" />
                                <el-table-column width="95px" prop="event" label="异常事件" />

                            </el-table>
                        </div>

                    </div>
                    <div class="chartbox">
                        <h5>地图</h5>
                        <div id="weather3">
                            <img src="/imgs/rsimg.png" alt="临近中队" style="width:250px;margin: 0 auto;">
                        </div>
                    </div>
                </div>
            </div>

            <div id="RightBar" class="sideBar right opacity0">
                <i id="rightClickSpan" class="iconfont opration-handler" aria-hidden="true"
                    @click="hideRightPanel">&#xe653;</i>
                <div class="bar-content bar-content-right" id="rightContent">
                    <div class="chartbox">
                        <h5>五大多源数据</h5>
                        <ul class="chartList">
                            <li :key="index" v-for="(item, index) in fieldData" style="text-align: center;">
                                <span>{{ item.name }}</span>
                                <span :class="item.typecolor">
                                    <!-- {'typeA': item.type === '荒原风场', 'typeB': item.statetype === '海滨风场', 'typeC': item.type === '高山风场'} -->
                                    {{ item.type }}
                                </span>
                            </li>
                        </ul>
                    </div>
                    <div class="chartbox">
                        <h5>异常报警数据汇总</h5>
                        <div id="state"></div>
                    </div>
                    <div class="chartbox">
                        <h5>各物联网监控设备总计</h5>
                        <div id="powerSum"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 面板 -->
        <div class="infoview" style="overflow: auto; max-height: 850px; width:410px; top:60px;right:320px;"
            id="cameraInfoWindow" :style="{ visibility: cameraWindowVisible ? 'visible' : 'hidden' }">
            <table class="mars-table">
                <tbody>

                    <tr>

                        选择监控数据：
                        <el-select v-model="monitorSelecctValue" placeholder="请选择数据源" @change="changeMonitorSelect"
                            transfer="true" :popper-append-to-body="false">
                            <el-option v-for="item in monitorData" :key="item.value" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                        <!-- <td>下拉框：</td> -->
                        <!-- <td> -->
                        <!-- <select id="txtCrs" class="selectpicker form-control">
                        <option value="" selected="selected">默认</option>
                        <option value="EPSG:3857">火星</option>
                        <option value="EPSG:4326">地球</option>
                        <option value="EPSG:4490">太阳</option>
                        </select> -->
                        <!-- </td> -->
                    </tr>
                    <div class="table-wrapper">
                        <el-table :cell-style="tableFormatWarnColor"
                            :data="tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)" page-size:5>
                            <el-table-column width="100px" prop="name" label="监控名称" />
                            <el-table-column width="70px" prop="warn" label="状态" :formatter="tableFormatWarnStr" />
                            <el-table-column width="100px" label="显示操作"
                                :style="{ visibility: cameraVisible ? 'visible' : 'hidden' }">
                                <template slot-scope="{row, $index}">
                                    <el-button type="button" size="mini" @click="tableShowChange(row, $index)">{{ row.show ?
                                        "取消显示" : "显示" }}</el-button>
                                </template></el-table-column>
                            <el-table-column width="100px" label="报警操作">
                                <template slot-scope="{row, $index}">
                                    <el-button type="button" size="mini" @click="tableWarnChange(row, $index)">{{ row.warn ?
                                        "取消报警" : "报警" }}</el-button>
                                </template></el-table-column>
                        </el-table>
                        <el-pagination align='center' @size-change="handleSizeChange" @current-change="handleCurrentChange"
                            :current-page="currentPage" :page-sizes="[2, 5, 10]" :page-size="pageSize"
                            layout="total,  prev, pager, next, jumper" :total="tableData.length"
                            :popper-append-to-body="false" width="370px">
                        </el-pagination>
                    </div>
                </tbody>
            </table>
        </div>
        <DutySimulation :style="{ visibility: simulationInfoWindowVisible ? 'visible' : 'hidden' }"></DutySimulation>
        <ScenarioRehearsal></ScenarioRehearsal>
    </div>
</template>

<script>
import Analysis from "./subcomponents/Analysis/analysis.vue"
import Layout from "./subcomponents/Header/index";
import { mapMutations } from "vuex";
import MarsMap from "./mars-work/mars-map.vue"
import DutySimulation from "./subcomponents/DutySimulation/index.vue"

import * as mars3d from 'mars3d'
import CesiumRoleController from "../../../public/lib/CesiumRoleController/CesiumRoleController.js"
import $ from 'jquery'
import * as turf from '@turf/turf'
import * as echarts from "echarts"
// eslint-disable-next-line no-unused-vars
import { CanvasBillboard } from "../../../public/lib/custom/CanvasBillboard.js"
import ScenarioRehearsal from "@/components/Scene/subcomponents/ScenarioRehearsal/index.vue";

const Cesium = mars3d.Cesium

export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'Index',

    components: {
        MarsMap,
        Layout,
        DutySimulation,
        ScenarioRehearsal,

        Analysis
    },
    data() {
        const basePathUrl = window.basePathUrl || ' '
        const mapOptions = {
            scene: {
                requestRenderMode: true, //开启显式渲染
                center: { lat: 20.648765, lng: 129.340334, alt: 19999976, heading: 355, pitch: -89 },
                scene3Donly: true,
                fxaa: false,
                contextOptions: {
                    requestWebgl1: true
                },
                globe: {
                    depthTestAgainstTerrain: true // 不加无法投射到地形上
                }
            },
            layers: [{
                id: "建筑中心区",
                type: "3dtiles",
                url: "../../../mars3dModels/3dt/tileset.json",
                position: { lng: 101.299403, lat: 37.997105, alt: 2775 },
                maximumScreenSpaceError: 16,
                tooltip: "特殊场景",
                rotation: {
                    z: 70
                },
                scale: 0.02,
                show: true
            },
            { id: "哨塔1", type: "3dtiles", url: "../../../mars3dModels/tower/tileset.json", position: { lng: 101.300796, lat: 37.999251, alt: 2967.7 }, maximumScreenSpaceError: 16, tooltip: "哨塔", rotation: { z: 70 }, scale: 6, show: true }, { id: "哨塔11", type: "3dtiles", url: "../../../mars3dModels/tower/tileset.json", position: { lng: 101.300796, lat: 37.999251, alt: 2993.8 }, maximumScreenSpaceError: 16, tooltip: "哨塔", rotation: { z: 70 }, scale: 6, show: true },
            { id: "哨塔2", type: "3dtiles", url: "../../../mars3dModels/tower/tileset.json", position: { lng: 101.302279, lat: 37.996059, alt: 2967.7 }, maximumScreenSpaceError: 16, tooltip: "哨塔", rotation: { z: 70 }, scale: 6, show: true }, { id: "哨塔22", type: "3dtiles", url: "../../../mars3dModels/tower/tileset.json", position: { lng: 101.302279, lat: 37.996059, alt: 2993.8 }, maximumScreenSpaceError: 16, tooltip: "哨塔", rotation: { z: 70 }, scale: 6, show: true },
            { id: "哨塔3", type: "3dtiles", url: "../../../mars3dModels/tower/tileset.json", position: { lng: 101.297937, lat: 37.994942, alt: 2967.7 }, maximumScreenSpaceError: 16, tooltip: "哨塔", rotation: { z: 70 }, scale: 6, show: true }, { id: "哨塔33", type: "3dtiles", url: "../../../mars3dModels/tower/tileset.json", position: { lng: 101.297937, lat: 37.994942, alt: 2993.8 }, maximumScreenSpaceError: 16, tooltip: "哨塔", rotation: { z: 70 }, scale: 6, show: true },
            { id: "哨塔4", type: "3dtiles", url: "../../../mars3dModels/tower/tileset.json", position: { lng: 101.296474, lat: 37.998026, alt: 2967.7 }, maximumScreenSpaceError: 16, tooltip: "哨塔", rotation: { z: 70 }, scale: 6, show: true }, { id: "哨塔44", type: "3dtiles", url: "../../../mars3dModels/tower/tileset.json", position: { lng: 101.296474, lat: 37.998026, alt: 2993.8 }, maximumScreenSpaceError: 16, tooltip: "哨塔", rotation: { z: 70 }, scale: 6, show: true },
            ]
        }
        // var windLayer = new mars3d.layer.WindLayer()
        var chinaLayer = new mars3d.layer.GeoJsonLayer()

        return {
            simulationInfoWindowVisible: false,
            analysisVisible: false,
            activeId: null,  // 用于跟踪当前激活的导航项的ID
            navItems: [
                { id: 1, title: "智能物联", icon: "../../../imgs/navLogo/智能物联-normal.svg", normalIcon: "../../../imgs/navLogo/智能物联-normal.svg", hoverIcon: "../../../imgs/navLogo/智能物联-hover.svg", activeIcon: "../../../imgs/navLogo/智能物联-click.svg" },
                { id: 2, title: "执勤模拟", icon: "../../../imgs/navLogo/执勤模拟-normal.svg", normalIcon: "../../../imgs/navLogo/执勤模拟-normal.svg", hoverIcon: "../../../imgs/navLogo/执勤模拟-hover.svg", activeIcon: "../../../imgs/navLogo/执勤模拟-click.svg" },
                { id: 3, title: "辅助分析", icon: "../../../imgs/navLogo/辅助分析-normal.svg", normalIcon: "../../../imgs/navLogo/辅助分析-normal.svg", hoverIcon: "../../../imgs/navLogo/辅助分析-hover.svg", activeIcon: "../../../imgs/navLogo/辅助分析-click.svg" },
                { id: 4, title: "方案预演", icon: "../../../imgs/navLogo/方案预演-normal.svg", normalIcon: "../../../imgs/navLogo/方案预演-normal.svg", hoverIcon: "../../../imgs/navLogo/方案预演-hover.svg", activeIcon: "../../../imgs/navLogo/方案预演-click.svg" },
            ],

            configUrl: basePathUrl + 'config/config.json',
            mapOptions: mapOptions,
            windLayer: null,
            chinaLayer,
            controller: null,
            isMapLoaded: false,

            // 记录面板展开状态
            isLeftOpen: true,
            isRightOpen: true,
            isBottomOpen: true,

            // 属性名
            fieldData: [
                { name: "房屋监控", type: "物联网监控", typecolor: 'typeA' },
                { name: "无人机", type: "巡航拍摄", typecolor: 'typeB' },
                { name: "高清摄像头", type: "视频设备", typecolor: 'typeC' },
                { name: "激光光栅", type: "物体探测", typecolor: 'typeA' },
                { name: "雷达扫描", type: "物体探测", typecolor: 'typeB' }
            ],

            // 统计图表
            // 右侧
            chartsDataState: [
                { name: "监控", value: 0 },
                { name: "无人机", value: 0 },
                { name: "光栅", value: 0 }
            ],
            myChartState: null,
            myOptionState: {},

            chartsDataPower: [
                { name: "房屋", value: 0 },
                { name: "摄像头", value: 0 },
                { name: "无人机", value: 0 },
                { name: "光栅", value: 0 }
            ],
            myChartPower: null,
            myOptionPower: {},

            //建筑信息
            buildInfo: [{ "name": "特殊建筑1", "status": "正常", "pop": "2", "floor": "2", "prop": "管理人员住宅", "lnglat": [101.298535, 37.995748, 2996.7] },
            { "name": "特殊建筑2", "status": "正常", "pop": "7", "floor": "2", "prop": "管理人员住宅", "lnglat": [101.298206, 37.996404, 3003] },
            { "name": "特殊建筑3", "status": "正常", "pop": "1", "floor": "2", "prop": "特殊人群住宅", "lnglat": [101.297843, 37.997071, 3002.6] },
            { "name": "特殊建筑4", "status": "正常", "pop": "2", "floor": "2", "prop": "特殊人群住宅", "lnglat": [101.297549, 37.99771, 3002.2] },
            { "name": "特殊建筑5", "status": "正常", "pop": "6", "floor": "2", "prop": "特殊人群住宅", "lnglat": [101.299855, 37.996242, 3003.4] },
            { "name": "特殊建筑6", "status": "异常", "pop": "3", "floor": "2", "prop": "特殊人群住宅", "lnglat": [101.299003, 37.998147, 3002.2] },
            { "name": "特殊建筑7", "status": "异常", "pop": "1", "floor": "2", "prop": "特殊人群住宅", "lnglat": [101.301196, 37.996613, 3003.4] },
            { "name": "特殊建筑8", "status": "异常", "pop": "7", "floor": "2", "prop": "特殊人群住宅", "lnglat": [101.300948, 37.997332, 3003] },
            { "name": "特殊建筑9", "status": "警戒", "pop": "4", "floor": "2", "prop": "特殊人群住宅", "lnglat": [101.300623, 37.997913, 3002.6] },
            { "name": "特殊建筑10", "status": "警戒", "pop": "2", "floor": "2", "prop": "特殊人群住宅", "lnglat": [101.300358, 37.998515, 3002.2] },
            { "name": "中央公园", "status": "正常", "pop": "0", "floor": "0", "prop": "无住宅", "lnglat": [101.299339, 37.997085, 2982.6] },
            ],
            //监控信息
            cameraInfo: [{ "name": "监控1", "warn": false, "show": true, "lnglat": [101.302113, 37.996224, 3000.3] },
            { "name": "监控2", "warn": true, "show": true, "lnglat": [101.300802, 37.999158, 2998.5] },
            { "name": "监控3", "warn": true, "show": true, "lnglat": [101.296672, 37.997986, 2998.6] },
            { "name": "监控4", "warn": false, "show": true, "lnglat": [101.340082, 37.996392, 3026.8] },
            { "name": "监控12", "warn": true, "show": true, "lnglat": [101.298009, 37.995055, 3000.4] },
            { "name": "监控13", "warn": true, "show": true, "lnglat": [101.298009, 37.993055, 3000.4] },
            ],
            //无人机信息
            UAVInfo: [{ "name": "无人机1", "warn": false, "show": true, "lnglat": [101.300783, 37.999387, 3040] },
            { "name": "无人机2", "warn": true, "show": true, "lnglat": [101.296727, 37.998116, 3010] },
            { "name": "无人机3", "warn": true, "show": true, "lnglat": [101.297172, 37.994219, 3020] },
            { "name": "无人机4", "warn": false, "show": true, "lnglat": [101.301989, 37.996072, 3030] },
            { "name": "无人机5", "warn": true, "show": true, "lnglat": [101.301649, 37.997679, 3040] },
            { "name": "无人机6", "warn": true, "show": true, "lnglat": [101.29696, 37.996347, 3050] },
            { "name": "无人机7", "warn": true, "show": true, "lnglat": [101.297977, 37.998488, 3060] },
            { "name": "无人机8", "warn": false, "show": true, "lnglat": [101.299695, 37.998981, 3070] },
            { "name": "无人机9", "warn": true, "show": true, "lnglat": [101.299164, 37.995121, 3080] },
            { "name": "无人机10", "warn": true, "show": true, "lnglat": [101.300868, 37.995662, 3090] },
            ],
            //无人机信息
            LightInfo: [{ "name": "光栅1", "warn": false },
            { "name": "光栅2", "warn": true },
            { "name": "光栅3", "warn": true },
            { "name": "光栅4", "warn": false },
            { "name": "光栅5", "warn": true },],
            warnInfo: [{ "name": "监控1", "type": "监控", "event": "行人" }],
            //表格分页
            currentPage: 1, // 当前页码
            total: 6, // 总条数
            pageSize: 5, // 每页的数据条数
            cameraWindowVisible: false,
            monitorData:
                [{
                    value: 1,
                    label: '视频监控'
                }, {
                    value: 2,
                    label: '无人机'
                }, {
                    value: 3,
                    label: '光栅'
                }],
            monitorSelecctValue: 1,
            cameraVisible: true,
            tableData: [],
            isAddLidar: false,
            timeoutId: null,
            intervalShowId: null,
            intervalHideId2: null,
        }
    },
    methods: {
        // 底部导航切换
        clickItem(id) {
            this.activeId = id;  // 设置当前激活的导航项ID
            this.navItems.forEach(item => {
                // 保证仅一个固定高亮
                item.icon = this.activeId === item.id ? item.activeIcon : item.normalIcon;
            });
            switch (id) {
                case 1:
                    this.cameraWindowVisible = true;
                    this.simulationInfoWindowVisible = false
                    this.analysisVisible = false
                    this.turnToBuilding()
                    this.addInfoUI()
                    this.addCameraUI()
                    if (!this.isAddLidar) this.addLidarGraphic()
                    this.isAddLidar = true
                    this.map.getLayerById("lidarLayer").show = true;
                    if (!this.timeoutId) {
                        this.intervalShowId = setInterval(this.addRedLight, 3000);
                        this.timeoutId = setTimeout(() => { this.intervalHideId = setInterval(this.HideRedLight, 3000); }, 1000);
                    }
                    break;
                case 2:
                    this.cameraWindowVisible = false;
                    this.simulationInfoWindowVisible = true
                    this.analysisVisible = false
                    this.addInfoUI()
                    this.turnToBuilding()
                    this.hideCameraGraph();
                    this.hideLeftPanel();
                    this.hideRightPanel();
                    const lidarLayer = this.map.getLayerById("lidarLayer");
                    if (lidarLayer) { lidarLayer.show = false; }
                    if (this.timeoutId) {
                        clearTimeout(this.timeoutId)
                        clearInterval(this.intervalShowId)
                        clearInterval(this.intervalHideId)
                        this.timeoutId = null
                    }
                    this.HideRedLight()
                    break;
                case 3:
                    this.cameraWindowVisible = false;
                    this.simulationInfoWindowVisible = false
                    this.analysisVisible = true
                    this.hideCameraGraph();

                    console.log(id)
                    break;
                default:
                    console.log(id)
            }
        },
        hoverItem(id) {
            const item = this.navItems.find((i) => i.id === id);
            if (item) {
                if (item.icon !== item.activeIcon) {
                    item.icon = item.hoverIcon
                }
            }
        },
        unhoverItem(id) {
            const item = this.navItems.find((i) => i.id === id);
            if (item) {
                if (item.icon !== item.activeIcon) {
                    item.icon = item.normalIcon
                }
            }
        },
        // 初始过渡动画
        initAnimate() {
            var x = {
                size: 150,
                weight: 8,
                color: ["#177cb0", "#f8f8f8", "#f8f8f8", "#f8f8f8", "#f8f8f8", "#f8f8f8", "#8d4bbb", "#f8f8f8", "#f8f8f8", "#f8f8f8", "#f47983", "#f8f8f8", "#f8f8f8", "#f8f8f8", "#f47983", "#f8f8f8", "#f8f8f8", "#f8f8f8", "#f8f8f8", "#f8f8f8", "#f8f8f8", "#f8f8f8", "#f47983", "#f8f8f8", "#f8f8f8", "#f8f8f8", "#f8f8f8", "#f8f8f8"],
                duration: 0.35,
                delay: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2, 2.1, 2.2, 2.3, 2.4],
                fade: 0.5,
                individualDelays: false,
                easing: d3_ease.easeSinInOut.ease
            };
            var element = $(".animated_text")[0];
            var z = new Letters(element, x);
            z.show();
            // 遮罩层点击事件被触发 跳过动画
            $(".page-overlay").on("click", function () {
                console.log("跳过动画")
                $(".title").addClass("animated rollIn");
                // $(".schoolTitle").addClass("animated bounceIn")
                $(".logo-list").addClass("animated fadeInUp")
                !$(".page-overlay").hasClass("loaded") && $(".page-overlay").addClass('loaded')
                $(".page-overlay").hasClass("loaded") && $(".page-overlay").css("display", "none") && $("#PC").css("display", "block")
            });
            // 动画
            setTimeout(function () {
                $(".title").addClass("animated rollIn");
                // $(".schoolTitle").addClass("animated bounceIn")
                $(".logo-list").addClass("animated fadeInUp")
            }, 3000);
            setTimeout(function () {
                !$(".page-overlay").hasClass("loaded") && $(".page-overlay").addClass('loaded')
            }, 6000)
            setTimeout(function () {
                $(".page-overlay").hasClass("loaded") && $(".page-overlay").css("display", "none") && $("#PC").css("display", "block")
            }, 7000)
        },
        ...mapMutations('global', ['setCurrentTurbineId', 'setWindFieldId']),
        // 地图构造完成回调
        onMapload() {
            // 开场
            this.map.openFlyAnimation()
            this.map.fixedLight = true // 固定光照，避免gltf模型随时间存在亮度不一致。
            this.map.setCameraView({ lat: 31.817475, lng: 109.687166, alt: 19999976, heading: 355, pitch: -90 })
            // this.map.scene.globe.terrainExaggeration = 2 // 修改地形夸张程度
            // 宇宙天空盒
            this.map.scene.skyBox = new Cesium.SkyBox({
                sources: {
                    negativeX: "../../../imgs/skybox/tycho2t3_80_mx.jpg",
                    negativeY: "../../../imgs/skybox/tycho2t3_80_my.jpg",
                    negativeZ: "../../../imgs/skybox/tycho2t3_80_mz.jpg",
                    positiveX: "../../../imgs/skybox/tycho2t3_80_px.jpg",
                    positiveY: "../../../imgs/skybox/tycho2t3_80_py.jpg",
                    positiveZ: "../../../imgs/skybox/tycho2t3_80_pz.jpg"
                }
            })
            // 近地天空盒 晴天
            const qingtianSkybox = new mars3d.GroundSkyBox({
                sources: {
                    positiveX: "../../../imgs/skybox_near/rightav9.jpg",
                    negativeX: "../../../imgs/skybox_near/leftav9.jpg",
                    positiveY: "../../../imgs/skybox_near/frontav9.jpg",
                    negativeY: "../../../imgs/skybox_near/backav9.jpg",
                    positiveZ: "../../../imgs/skybox_near/topav9.jpg",
                    negativeZ: "../../../imgs/skybox_near/bottomav9.jpg"
                }
            })
            let defaultSkybox = this.map.scene.skyBox
            this.map.on(mars3d.EventType.postRender, () => {
                const position = this.map.camera.position
                const height = Cesium.Cartographic.fromCartesian(position).height
                if (height < 230000) {
                    this.map.scene.skyBox = qingtianSkybox
                    this.map.scene.skyAtmosphere.show = false
                } else {
                    if (defaultSkybox) {
                        this.map.scene.skyBox = defaultSkybox
                    }
                    this.map.scene.skyAtmosphere.show = true
                }
            })

            // 人物控制器
            this.controller = new CesiumRoleController(mars3d.Cesium, this.map.viewer)

            this.addWindLayer()
            this.addOtherLayer()
            // this.addOtherFactoryLayer()
            this.addChinaMap()
            setTimeout(function () {
                $(".sideBar.left").removeClass("opacity0").removeClass("fadeOutLeft").addClass("animated fadeInLeft")
                $(".sideBar.right").removeClass("opacity0").removeClass("fadeOutRight").addClass("animated fadeInRight")
                // $(".bottomBar").removeClass("opacity0").removeClass("fadeOutDown").addClass("animated fadeInUp")
            }, 2000)

            // 右侧
            let state = document.getElementById("state")
            let powerSum = document.getElementById("powerSum")
            // 左侧
            let weather1 = document.getElementById("weather1")
            let weather2 = document.getElementById("weather2")
            let weather3 = document.getElementById("weather3")
            this.initCharts(this.chartsDataState, this.chartsDataPower, this.chartsDataWeather1,
                this.chartsDataWeather2, this.chartsDataWeather3, state, powerSum, weather1, weather2, weather3)

            //webgl渲染失败后，刷新页面
            this.map.on(mars3d.EventType.renderError, function () {
                window.location.reload();
            });

            this.isMapLoaded = true;
        },
        // 新版添加其他图层
        addOtherLayer() {
            // 添加道路
            var otherLayer = new mars3d.layer.GraphicLayer()
            this.map.addLayer(otherLayer)
            const roadGraphic = new mars3d.graphic.Road({
                positions: [
                    [101.287402, 37.993511, 3044.6],
                    [101.305531, 38.003163, 2972.7]
                ],
                style: {
                    image: "../../../imgs/road.jpg",
                    width: 50,
                    height: 1
                }
            })
            otherLayer.addGraphic(roadGraphic)

            // 添加车辆
            var carGraphic = new mars3d.graphic.ModelPrimitive({
                id: 1,
                position: [101.300096, 38.000135, 2995.6],
                style: {
                    // url: '//data.mars3d.cn/gltf/mars/dajiang/dajiang.gltf',
                    url: '//data.mars3d.cn/gltf/imap/897ec2fdcdcd4ac181ecc5ed1c48018c/gltf/gltf2.gltf',
                    heading: -35,
                    scale: 5,
                    // scale: 100,
                    minimumPixelSize: 1,
                },
            })
            otherLayer.addGraphic(carGraphic)

            // 添加名称
            var factoryTitle = 'GeoSSMS特殊场景'
            var factoryPosition = { lat: 37.997767, lng: 101.301809 }
            var titleGraphic = new mars3d.graphic.LabelEntity({
                position: new mars3d.LngLatPoint(factoryPosition.lng, factoryPosition.lat, factoryPosition.lat),
                style: {
                    text: factoryTitle,
                    font_size: 30,
                    font_family: "楷体",
                    color: "#0081c2",
                    outline: true,
                    outlineColor: "#ffffff",
                    outlineWidth: 2,
                    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 1000000),
                    clampToGround: true,

                    // 高亮时的样式（默认为鼠标移入，也可以指定type:'click'单击高亮），构造后也可以openHighlight、closeHighlight方法来手动调用
                    highlight: {
                        font_size: 40,
                        type: 'click'
                    }
                },
            })
            otherLayer.addGraphic(titleGraphic)
        },
        addChinaMap() {
            this.chinaLayer = new mars3d.layer.GeoJsonLayer({
                name: "全国省界",
                url: "../../../chinaData/中国行政区划.json",
                format: this.simplifyGeoJSON, // 用于自定义处理geojson
                symbol: {
                    type: "polylineC",
                    styleOptions: {
                        width: 2,
                        materialType: mars3d.MaterialType.LineFlow,
                        materialOptions: {
                            color: "#00ffff",
                            speed: 10,
                            repeat_x: 10
                        },
                        distanceDisplayCondition: true,
                        distanceDisplayCondition_far: 30000000,
                        distanceDisplayCondition_near: 2000000
                    }
                },
            })
            this.map.addLayer(this.chinaLayer)
        },
        // 简化geojson的坐标
        simplifyGeoJSON(geojson) {
            try {
                geojson = turf.simplify(geojson, { tolerance: 0.0001, highQuality: true, mutate: true })
            } catch (e) {
                //
            }
            return geojson
        },
        addWindLayer() {
            this.windLayer = new mars3d.layer.WindLayer({
                id: '风场',
                particlesNumber: 9000,
                fadeOpacity: 0.996,
                dropRate: 0.003,
                dropRateBump: 0.01,
                speedFactor: 0.05,
                lineWidth: 4.0,
                // 色带配置
                color: [
                    "rgb(4,14,216)"
                ]
            })
            this.map.addLayer(this.windLayer)
            this.loadNetCDF("/weather/wind.nc").then((data) => {
                if (this.windLayer !== null) {
                    this.windLayer.setData(data)
                }
            })
        },
        loadNetCDF(filepath) {
            return new Promise(function (resolve) {
                const request = new XMLHttpRequest()
                request.open("GET", filepath)
                request.responseType = "arraybuffer"

                request.onload = function () {
                    const arrayToMap = function (array) {
                        return array.reduce(function (map, object) {
                            map[object.name] = object
                            return map
                        }, {})
                    }

                    // eslint-disable-next-line new-cap
                    const NetCDF = new netcdfjs(request.response)
                    const variables = arrayToMap(NetCDF.variables)
                    const uAttributes = arrayToMap(variables.U.attributes)
                    const vAttributes = arrayToMap(variables.V.attributes)

                    const arrLon = NetCDF.getDataVariable("lon").flat()
                    const arrLat = NetCDF.getDataVariable("lat").flat()
                    const arrU = NetCDF.getDataVariable("U").flat()
                    const maxU = uAttributes.max.value
                    const minU = uAttributes.min.value
                    const arrV = NetCDF.getDataVariable("V").flat()
                    const maxV = vAttributes.max.value
                    const minV = vAttributes.min.value

                    // 构造WindLayer类需要的格式数据
                    const result = {
                        xmin: Math.min(...arrLon),
                        xmax: Math.max(...arrLon),
                        ymin: Math.min(...arrLat),
                        ymax: Math.max(...arrLat),
                        rows: arrLat.length,
                        cols: arrLon.length,
                        udata: arrU,
                        vdata: arrV,
                        umin: minU,
                        umax: maxU,
                        vmin: minV,
                        vmax: maxV
                    }
                    resolve(result)
                }
                request.send()
            })
        },
        // 控制风场
        chargeWindField() {
            if (!this.windLayer) {
                this.addWindLayer()
                this.map.setCameraView({ lat: 31.817475, lng: 109.687166, alt: 19999976, heading: 355, pitch: -90 })
            }
            else {
                this.map.removeLayer(this.windLayer, true)
                this.windLayer = null
            }
        },
        // 控制人物
        controlCha() {
            if (!this.isControl) {
                this.map.setCursor("crosshair")

                this.map.once("click", (event) => {
                    this.map.setCursor("default")
                    this.initController(event.cartesian)
                })
                this.isControl = true
            } else {
                this.controller.destroy()
                this.isControl = false
            }
        },
        initController(position) {
            const point = mars3d.LngLatPoint.fromCartesian(position) // 转为经纬度
            this.controller.init({
                position: [point.lng, point.lat, point.alt],
                url: "../../../mars3dModels/running.glb",
                animation: "run",
                lockViewLevel: 3,
                pitch: -10,
                speed: 5,
                range: 8
            })
            this.isControl = true
        },
        // 返回首页
        backToHome() {
            this.$router.push('/login')
            // 清除计时器
            if (this.intervalId !== null) {
                // 如果已经有一个正在运行的定时器，停止它
                clearInterval(this.intervalId);
                this.intervalId = null;
            }
        },
        // 检视风电场
        turnToBuilding() {
            // 移除风场
            if (this.windLayer) {
                this.map.removeLayer(this.windLayer, true)
                this.windLayer = null
            }
            // 移除中国地图
            if (this.chinaLayer) {
                this.map.removeLayer(this.chinaLayer, true)
                this.chinaLayer = null
            }

            // this.map.setCameraView({"lat":43.573973,"lng":87.903254,"alt":1262.6,"heading":134.6,"pitch":-3.4})
            this.map.setCameraView({ "lat": 38.00081, "lng": 101.312725, "alt": 3261.5, "heading": 250.9, "pitch": -10.2 })
            // 开启键盘漫游
            // this.map.keyboardRoam.enabled = true
            // this.map.keyboardRoam.minHeight = 80
            // this.map.keyboardRoam.setOptions({
            //     moveStep: 0.5, // 平移步长 (米)。
            //     dirStep: 5, // 相机原地旋转步长，值越大步长越小。
            //     rotateStep: 2.0, // 相机围绕目标点旋转速率，0.3-2.0
            //     minPitch: 0.1, // 最小仰角  0-1
            //     maxPitch: 0.95 // 最大仰角  0-1
            // })
            // this.hideBottomPanel()
            // 添加场站
            // if (!this.isStationLoaded) {
            //     this.addOtherFactoryLayer()
            //     this.isStationLoaded = true
            // }
            this.addInfoUI()
            this.addCameraUI()
        },
        // 添加Echarts图形
        // chart Echart圆形
        // chart Echart柱状
        // chart Echart其他
        // 参数为前数据 后dom
        initCharts(arrState, arrPowerSum, arrWeather1, arrWeather2, arrWeather3, state, powerSum, weather1, weather2, weather3) {
            // 风机状态统计图
            this.myChartState = echarts.init(state)
            this.myOptionState = {
                tooltip: {
                    trigger: "item",
                    formatter: "{b}<br/>{c} 占{d}%",
                },
                // 图例 的相关设置
                legend: {
                    orient: "vertical",
                    left: "right",
                    textStyle: {
                        color: "#fff"
                    }
                },
                // 图形的设置
                series: [
                    {
                        // name: '访问来源',
                        type: "pie",
                        radius: "80%",
                        right: "20%",
                        // 图形上文本标签的样式设置
                        label: {
                            show: true,
                            position: "inside",
                            formatter: "{c}",
                            fontWeight: "bold"
                        },
                        color: [
                            "#E6224F99",
                            "#2CB5E599",
                            "#E6D91599"
                        ],
                        center: ["45%", "55%"],
                        data: arrState, // 使用for循环添加
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: "rgba(0, 0, 0, 0.5)"
                            }
                        }
                    }
                ]
            }
            this.myChartState.setOption(this.myOptionState)

            // 各风电场预测总功率统计图
            const arrName = []
            const arrValue = []
            for (let i = 0; i < arrPowerSum.length; i++) {
                arrName[i] = arrPowerSum[i].name
                arrValue[i] = arrPowerSum[i].value
            }
            this.myChartPower = echarts.init(powerSum)
            this.myOptionPower = {
                // xAxis和yAxis的nameTextStyle不起作用
                // 因此设置了字体的全局样式
                textStyle: {
                    color: "#ccc"
                },
                title: {
                    text: "单位:" + "个",
                    // 全局样式对此不生效，
                    textStyle: {
                        color: "#fff",
                        fontSize: 12
                    }
                },
                // 移入柱子时的阴影
                tooltip: {
                    trigger: "axis",
                    formatter: "{b}<br/>{c}" + "",
                    axisPointer: {
                        type: "shadow"
                    }
                },
                grid: {
                    left: "5px",
                    right: "0",
                    bottom: "5px",
                    containLabel: true
                },
                xAxis: {
                    type: "category",
                    data: arrName
                },
                yAxis: {
                    type: "value"
                },
                series: [
                    {
                        // 柱子的相关设置
                        itemStyle: {
                            color: "rgb(0, 174, 255)"
                        },
                        barWidth: "20px",
                        type: "bar",
                        emphasis: {
                            focus: "series"
                        },
                        data: arrValue
                    }
                ]
            }
            this.myChartPower.setOption(this.myOptionPower)

            this.myChartState.resize({ width: 258, height: 182 })
            this.myChartPower.resize({ width: 258, height: 182 })

            window.addEventListener("resize", () => {
                this.myChartState.resize()
                this.myChartPower.resize()
            })
            return
        },


        hideLeftPanel() {
            this.isLeftOpen = !this.isLeftOpen
            if (this.isLeftOpen == false) {
                $(".sideBar.left").removeClass("fadeInLeft").addClass("fadeOutLeft")
                $(".sideBar.left").removeClass("fadeOutLeft").css({
                    "width": "1%",
                    "display": "block",
                    "opacity": "1",
                    "box-shadow": "none",
                    "background-color": "rgba(1, 48, 102, 0.8)"
                })
                $(".bar-content-left").css("display", "none")
            }
            else {
                $(".sideBar.left").addClass("fadeInLeft")
                $(".sideBar.left").css({
                    "width": "20%",
                    "opacity": "0",
                    "box-shadow": "0 10px 100px 0 rgba(1, 48, 102, 0.8) inset",
                    "background-color": "transparent"
                })
                setTimeout(function () {
                    $(".bar-content-left").css("display", "flex")
                }, 1000)
            }
        },
        hideRightPanel() {
            this.isRightOpen = !this.isRightOpen
            if (this.isRightOpen == false) {
                $(".sideBar.right").removeClass("fadeInRight").addClass("fadeOutRight")
                $(".sideBar.right").removeClass("fadeOutRight").css({
                    "width": "1%",
                    "display": "block",
                    "opacity": "1",
                    "box-shadow": "none",
                    "background-color": "rgba(1, 48, 102, 0.8)"
                })
                $(".bar-content-right").css("display", "none")
            }
            else {
                $(".sideBar.right").addClass("fadeInRight")
                $(".sideBar.right").css({
                    "width": "20%",
                    "opacity": "0",
                    "box-shadow": "0 10px 100px 0 rgba(1, 48, 102, 0.8) inset",
                    "background-color": "transparent"
                })
                setTimeout(function () {
                    $(".bar-content-right").css("display", "flex")
                }, 1000)
            }
            // this.myChartState.resize({width: 258,height: 182})
            // this.myChartPower.resize({width: 258,height: 182})
            console.log("resize")
        },
        closeImgPanel() {
            $("#explanatoryPicture").css("display", "none")
        },
        // 添加监控UI面板
        addInfoUI() {
            if (this.map.getLayerById("infoUIGraph"))
                this.map.removeLayer(this.map.getLayerById("infoUIGraph"), true)
            // 添加监控面板

            function addPopUI(graphicLayer, position, obj) {
                // graphicLayer=new mars3d.layer.GraphicLayer()
                var popcolorstr = '#FFFFFF'
                var linecolor = "#5b8fee"
                var ico_filename = "house.svg"
                if (obj.status == "异常") {
                    popcolorstr = '#FF0000'
                    linecolor = popcolorstr
                    ico_filename = "house_red.svg"
                }
                else if (obj.status == "警戒") {
                    popcolorstr = '#FFBB00'
                    linecolor = popcolorstr
                    ico_filename = "house_orange.svg"
                }

                const graphicImg = new mars3d.graphic.DivGraphic({
                    position: position,
                    id: obj.name + "popui",
                    style: {
                        html: ` <div class="mars3d-camera-content" style="height: 30px;cursor:pointer">
                                    <svg width="30px" height="50px" xmlns="http://www.w3.org/2000/svg">
                                        <image href="../../imgs/${ico_filename}" width="30" height="30">
                                            <animate attributeName="y" values="20;0;20" keyTimes="0;0.5;1" dur="2s" repeatCount="indefinite" />
                                        </image>
                                    </svg>
                                </div>
                                <div class="mars3d-camera-line" style="height: 80px;width: 5px;margin-top: 20px;
                                border-left: 3px dashed ${linecolor};margin-left: calc(50% - 1px);"></div>
                                <div class="mars3d-camera-point" style="border-radius: 50%;width: 8px;height: 8px;
                                margin-left: calc(50% - 3px);background-color: ${linecolor};"></div>
                            `,
                        offsetX: -16,
                        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 100000)
                    },
                    popup: `<table style="width:280px;">
                <tr><th scope="col" colspan="4"  style="text-align:center;font-size:15px;"></th></tr>
                <tr><td >楼栋名称</td><td >${obj.name} </td></tr>
                <tr><td >状态</td><td style="color:${popcolorstr};">${obj.status} </td></tr>
                <tr><td >人数</td><td >${obj.pop}人</td></tr>
                <tr><td >楼层</td><td >${obj.floor}层</td></tr>
                <tr><td >性质</td><td >${obj.prop}</td></tr>
                <tr><td >时间：</td><td id="tdTime"></td></tr>
              </table>`,
                    popupOptions: {
                        offsetY: -170, // 显示Popup的偏移值，是DivGraphic本身的像素高度值
                        template: `<div class="marsBlackPanel" style="min-width: 90px;min-height: 35px;position: absolute;left: 16px;bottom: 10px;
                                        cursor: default;border-radius: 4px;opacity: 0.96;border: 1px solid #14171c;box-shadow: 0px 2px 21px 0px rgba(33, 34, 39, 0.55);
                                        border-radius: 4px;box-sizing: border-box;background: linear-gradient(0deg, #1e202a 0%, #0d1013 100%);">
                                        <div class="marsBlackPanel-text" style="width: 100%;height: 100%;min-height: 33px;text-align: center;padding: 5px 5px 0 5px;
                                            margin: 0;font-size: 14px;font-weight: 400;color: #ffffff;border: 1px solid #ffffff4f;-webkit-box-sizing: border-box;
                                            box-sizing: border-box;white-space: nowrap;">
                                            {content}
                                        </div>
                                    </div>`,
                        horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                        verticalOrigin: Cesium.VerticalOrigin.CENTER
                    }
                })
                graphicLayer.addGraphic(graphicImg)
                // 刷新局部DOM,不影响popup面板的其他控件操作
                graphicImg.on(mars3d.EventType.postRender, function (event) {
                    const container = event.container // popup对应的DOM
                    const tdTime = container.querySelector("#tdTime")
                    if (tdTime) {
                        const date = mars3d.Util.formatDate(new Date(), "yyyy-MM-dd HH:mm:ss S")

                        tdTime.innerHTML = date
                    }
                })
            }
            const tmpLayer = new mars3d.layer.GraphicLayer({ id: "infoUIGraph" })
            this.map.addLayer(tmpLayer)
            // addPopUI(tmpLayer,[101.299396,37.996705,3020.8])
            this.buildInfo.forEach(e => {
                addPopUI(tmpLayer, e.lnglat, e)
            });

        },
        addCameraUI() {

            function addCameraPopUI(graphicLayer, obj) {
                // graphicLayer=new mars3d.layer.GraphicLayer()
                var popcolorstr = '#FFFFFF'
                var linecolor = "#5b8fee"
                var ico_filename = "camera.svg"
                if (obj.warn) {
                    popcolorstr = '#FF0000'
                    linecolor = popcolorstr
                    ico_filename = "camera_red.svg"
                }

                const graphicImg = new mars3d.graphic.DivGraphic({
                    position: obj.lnglat,
                    id: obj.name + "graphic",
                    style: {
                        html: ` <div class="mars3d-camera-content" style="height: 30px;cursor:pointer">
                                    <svg width="30px" height="50px" xmlns="http://www.w3.org/2000/svg">
                                        <image href="../../imgs/${ico_filename}" width="30" height="30">
                                            <animate attributeName="y" values="20;0;20" keyTimes="0;0.5;1" dur="2s" repeatCount="indefinite" />
                                        </image>
                                    </svg>
                                </div>
                                <div class="mars3d-camera-line" style="height: 80px;width: 5px;margin-top: 20px;
                                border-left: 3px dashed ${linecolor};margin-left: calc(50% - 1px);"></div>
                                <div class="mars3d-camera-point" style="border-radius: 50%;width: 8px;height: 8px;
                                margin-left: calc(50% - 3px);background-color: ${linecolor};"></div>
                            `,
                        offsetX: -16,
                        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 100000)
                    },
                    popup: `<table style="width:280px;">
                <tr><th scope="col" colspan="4"  style="text-align:center;font-size:15px;"></th></tr>
                <tr><td >监控名称</td><td >${obj.name} </td></tr>
                <tr><td >时间：</td><td id="tdTime"></td></tr>
              </table>
              <video src='../../imgs/videos/买瓜.mp4' controls autoplay style="width: 300px;" ></video>`,
                    popupOptions: {
                        offsetY: -170, // 显示Popup的偏移值，是DivGraphic本身的像素高度值
                        template: `<div class="marsBlackPanel" style="min-width: 90px;min-height: 35px;position: absolute;left: 16px;bottom: 10px;
                                        cursor: default;border-radius: 4px;opacity: 0.96;border: 1px solid #14171c;box-shadow: 0px 2px 21px 0px rgba(33, 34, 39, 0.55);
                                        border-radius: 4px;box-sizing: border-box;background: linear-gradient(0deg, #1e202a 0%, #0d1013 100%);">
                                        <div class="marsBlackPanel-text" style="width: 100%;height: 100%;min-height: 33px;text-align: center;padding: 5px 5px 0 5px;
                                            margin: 0;font-size: 14px;font-weight: 400;color: #ffffff;border: 1px solid #ffffff4f;-webkit-box-sizing: border-box;
                                            box-sizing: border-box;white-space: nowrap;">
                                            {content}
                                        </div>
                                    </div>`,
                        horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                        verticalOrigin: Cesium.VerticalOrigin.CENTER
                    }
                })
                graphicLayer.addGraphic(graphicImg)
                // 刷新局部DOM,不影响popup面板的其他控件操作
                graphicImg.on(mars3d.EventType.postRender, function (event) {
                    const container = event.container // popup对应的DOM
                    const tdTime = container.querySelector("#tdTime")
                    if (tdTime) {
                        const date = mars3d.Util.formatDate(new Date(), "yyyy-MM-dd HH:mm:ss S")

                        tdTime.innerHTML = date
                    }
                })
            }
            function addUAV(gralayer, obj) {
                var uavGraphic = new mars3d.graphic.ModelPrimitive({
                    id: obj.name + "graphic",
                    position: obj.lnglat,
                    style: {
                        // url: '//data.mars3d.cn/gltf/mars/dajiang/dajiang.gltf',
                        url: '../../../mars3dModels/dajiang.gltf',
                        heading: 30,
                        scale: 100,
                        minimumPixelSize: 1,
                    },
                })
                gralayer.addGraphic(uavGraphic)
                console.log(uavGraphic)
            }

            var UILayer = this.map.getLayerById("CameraUIGraph")
            if (!UILayer) {
                // this.map.removeLayer(UILayer,true)
                UILayer = new mars3d.layer.GraphicLayer({ id: "CameraUIGraph" })
                this.map.addLayer(UILayer)
            }
            // if(!this.cameraVisible)return
            // UILayer= new mars3d.layer.GraphicLayer({ id: "CameraUIGraph" })
            // this.map.addLayer(UILayer)

            if (this.monitorSelecctValue == 1) {
                this.cameraInfo.forEach(e => {
                    var tmp = UILayer.getGraphicById(e.name + "graphic")
                    if (tmp) tmp.remove(true)
                    if (e.show) addCameraPopUI(UILayer, e)
                })
            } else if (this.monitorSelecctValue == 2) {
                this.UAVInfo.forEach(e => {
                    var graph_obj = UILayer.getGraphicById(e.name + "graphic")
                    if (!graph_obj) {
                        addUAV(UILayer, e)
                        graph_obj = UILayer.getGraphicById(e.name + "graphic")
                    }
                    graph_obj.show = e.show
                })
            }
        },
        hideUAVGraph() {
            var UILayer = this.map.getLayerById("CameraUIGraph")
            this.UAVInfo.forEach(e => {
                var graph_obj = UILayer.getGraphicById(e.name + "graphic")
                if (graph_obj) {
                    graph_obj.show = false
                }
            })
        },
        hideCameraGraph() {
            var UILayer = this.map.getLayerById("CameraUIGraph")
            this.cameraInfo.forEach(e => {
                var graph_obj = UILayer.getGraphicById(e.name + "graphic")
                if (graph_obj) {
                    graph_obj.show = false
                }
            })
        },
        tableFormatWarnStr(row, column) {
            if (row.warn === false) {
                return '正常'
            } else {
                return '异常'
            }
        },
        tableFormatWarnColor({ row, column, rowIndex, columnIndex }) {
            // 状态列字体颜色
            if (row.warn && columnIndex == 1) {
                return 'color: #FF0000'
            }
        },
        //每页条数改变时触发 选择一页显示多少行
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.currentPage = 1;
            this.pageSize = val;
        },
        //当前页改变时触发 跳转其他页
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.currentPage = val;
        },
        tableShowChange(row, $index) {
            row.show = !row.show
            this.addCameraUI()
        },
        tableWarnChange(row, $index) {
            row.warn = !row.warn
            this.addCameraUI()
            this.geneWarnInfo()
        },
        changeMonitorSelect(val) {
            switch (val) {
                case 1:
                    this.tableData = this.cameraInfo
                    this.cameraVisible = true
                    this.addCameraUI()
                    this.hideUAVGraph()
                    break;
                case 2:
                    this.tableData = this.UAVInfo
                    this.cameraVisible = true
                    this.addCameraUI()
                    this.hideCameraGraph()
                    break;
                case 3:
                    this.tableData = this.LightInfo
                    this.cameraVisible = false
                    this.hideCameraGraph()
                    this.hideUAVGraph()
                    break;
                default:
                    break;
            }
        },
        addLidarGraphic() {
            var graphicLayer = new mars3d.layer.GraphicLayer({ id: "lidarLayer" })
            const ellipsoid = new mars3d.graphic.EllipsoidEntity({
                position: [101.299381, 37.997154, 2987.5],
                style: {
                    radii: 500,
                    minimumClockDegree: -180.0,
                    maximumClockDegree: 180.0,
                    minimumConeDegree: 0.0,
                    maximumConeDegree: 90.0,
                    fill: false,
                    outline: true,
                    outlineColor: "rgba(0, 204, 0, 0.4)", // 绿色
                    stackPartitions: 100, // 竖向
                    slicePartitions: 100 // 横向
                },
                // 添加扫描面
                scanPlane: {
                    step: 10.0, // 步长
                    min: -180.0, // 最小值
                    max: 180.0, // 最大值
                    style: {
                        innerRadii: 200,
                        outline: true,
                        color: "rgba(255, 204, 0)",
                        outlineColor: "rgba(255, 204, 0, 0.1)",
                        // minimumClockDegree: 90.0,
                        // maximumClockDegree: 100.0,
                        // minimumConeDegree: 0.0,
                        // maximumConeDegree: 90.0
                    }
                }
            })
            this.map.addLayer(graphicLayer)

            graphicLayer.addGraphic(ellipsoid)
        },
        addRedLight() {
            var LightLayer = this.map.getLayerById("redLightLayer")
            if (!LightLayer) {
                LightLayer = new mars3d.layer.GraphicLayer({ id: "redLightLayer" })
                this.map.addLayer(LightLayer)
                const lightCone = new mars3d.graphic.LightCone({
                    position: [101.300096, 38.000135, 2995.6],
                    style: {
                        color: "rgba(255,0,0,0.9)",
                        radius: 8, // 底部半径
                        height: 50 // 椎体高度
                    },
                    show: true
                })
                LightLayer.addGraphic(lightCone)
            }
            LightLayer.show = true;
            console.log("执行光亮显示")
        },
        HideRedLight() {
            var LightLayer = this.map.getLayerById("redLightLayer")
            if (!LightLayer) return
            LightLayer.show = false
            console.log("执行光亮隐藏")
        },
        geneWarnInfo() {
            var eventSet = ["行人出现", "无人机出现", "车辆出现", "发现犯人", "野生动物", "可疑物品"]
            this.warnInfo = []
            this.chartsDataState[0].value = 0;
            this.chartsDataState[1].value = 0;
            this.chartsDataState[2].value = 0;
            this.cameraInfo.forEach(e => {
                if (e.warn) {
                    this.warnInfo.push({ "name": e.name, "type": "摄像头", "event": eventSet[Math.floor(Math.random() * eventSet.length)] })
                    this.chartsDataState[0].value++;
                }
            });
            this.UAVInfo.forEach(e => {
                if (e.warn) {
                    this.warnInfo.push({ "name": e.name, "type": "无人机", "event": eventSet[Math.floor(Math.random() * eventSet.length)] })
                    this.chartsDataState[1].value++;
                }
            });
            this.LightInfo.forEach(e => {
                if (e.warn) {
                    this.warnInfo.push({ "name": e.name, "type": "光栅", "event": eventSet[Math.floor(Math.random() * eventSet.length)] })
                    this.chartsDataState[2].value++;
                }
            });
        },
    },
    mounted() {
        this.initAnimate()
        this.tableData = this.cameraInfo
        this.geneWarnInfo()
        this.chartsDataPower[0].value = this.buildInfo.length
        this.chartsDataPower[1].value = this.cameraInfo.length
        this.chartsDataPower[2].value = this.UAVInfo.length
        this.chartsDataPower[3].value = this.LightInfo.length


    },
    watch: {
        myOptionState: {
            handler: function () {
                this.myChartState.setOption(this.myOptionState)
            },
            deep: true
        },
        myOptionPower: {
            handler: function () {
                this.myChartPower.setOption(this.myOptionPower)
            }
        },
    }

}

</script>


<style lang="less" scoped>
//@import "http://mars3d.cn/css/style.css";
//@import "http://mars3d.cn/lib/bootstrap/css/bootstrap.css";
@import "@/components/Scene/style/style.css";
@import "@/components/Scene/style/bootstrap.css";
// 底部导航栏
.bottom-nav {
    position: fixed;
    bottom: 20px;
    width: 100%;
    display: flex;
    justify-content: space-around;
    z-index: 1;
    padding: 0 300px;
}

.nav-item {
    cursor: pointer;
}

.nav-icon {
    width: 75px;
    height: 75px;
}

// 以下为除底部导航栏
.mapcontainer {
    position: relative;
    height: 100%;
    width: 100%;
    overflow: hidden;
    user-select: none;
}

#PC {
    display: none;
}

/* LOGO */
.logo-list {
    margin-top: 50px;
    /* position: absolute;
    bottom: 20px;
    left: 45%;*/
}

.logo-list img {
    height: 120px;
}

/* Loader */
.page-overlay {
    position: relative;
    z-index: 1;
    overflow: hidden;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-justify-content: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    background: #2c2e2f;
    z-index: 10000;
    zoom: 1;
    filter: alpha(opacity=100);
    -webkit-opacity: 1;
    -moz-opacity: 1;
    opacity: 1;
    -webkit-transition: all 800ms ease-in-out;
    -moz-transition: all 800ms ease-in-out;
    -o-transition: all 800ms ease-in-out;
    transition: all 800ms ease-in-out;
}

.page-overlay.loaded {
    zoom: 1;
    filter: alpha(opacity=0);
    -webkit-opacity: 0;
    -moz-opacity: 0;
    opacity: 0;
    visibility: hidden;
}

.page-overlay.clear {
    background: transparent;
}

/* AnimatedLetters */
.animated_text {
    position: relative;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-justify-content: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    max-width: 100%;
    color: transparent;
    pointer-events: none;
}

// 常规样式
.opacity0 {
    filter: alpha(opacity=0);
    -webkit-opacity: 0;
    -moz-opacity: 0;
    opacity: 0;
}

#teamName {
    font-size: 3em;
}

/* Bar */
.sideBar {
    position: absolute;
    top: 6vh;
    bottom: 0px;
    max-width: 320px;
    width: 20%;
    height: 100%;
    border: 1px rgba(255, 255, 255, 0.5) solid;
    border-radius: 5px;
    // background-color: transparent;
    box-shadow: 0 10px 100px 0 rgba(23, 49, 71, 0.8) inset;
    -webkit-transition: all 1000ms ease-in-out;
    -moz-transition: all 1000ms ease-in-out;
    -o-transition: all 1000ms ease-in-out;
    transition: all 1000ms ease-in-out;
}

.sideBar.left {
    left: 0;
}

.sideBar.right {
    right: 0;
}

.bar-content {
    display: flex;
    flex-direction: column;
    height: 94%;
    width: 100%;
    justify-content: space-around;
    align-items: center;
}

// 侧栏图表
.chartList {
    font-size: 14px;
    color: #ffffff;
    height: 90%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;

    li {
        border-bottom: white 0.5px dashed;
        padding-bottom: 5px;
    }

    li:hover {
        padding: 10px;
        background-color: rgba(32, 176, 203, 0.4);
    }

    .typeA {
        color: #CD6F43;
    }

    .typeB {
        color: #328D98;
    }

    .typeC {
        color: #E0B041;
    }
}

.chartbox {
    display: flex;
    flex-direction: column;
    width: 90%;
    height: 28.5%;
    border: 1px solid #17366c;
    background: linear-gradient(to left, #3897cf, #3897cf) left top no-repeat, linear-gradient(to bottom, #3897cf, #3897cf) left top no-repeat,
        linear-gradient(to left, #3897cf, #3897cf) right top no-repeat, linear-gradient(to bottom, #3897cf, #3897cf) right top no-repeat,
        linear-gradient(to left, #3897cf, #3897cf) left bottom no-repeat, linear-gradient(to bottom, #3897cf, #3897cf) left bottom no-repeat,
        linear-gradient(to left, #3897cf, #3897cf) right bottom no-repeat, linear-gradient(to left, #3897cf, #3897cf) right bottom no-repeat;
    background-size: 1px 20px, 20px 1px, 1px 20px, 20px 1px;
    background-color: rgba(0, 0, 0, 0.1);

    h5 {
        color: #ffffff;
        letter-spacing: 3px;
        text-align: center;
        margin-top: 2px;
    }
}

#state,
#powerSum,
#weather1,
#weather2,
#weather3 {
    width: 100%;
    height: 100%;
}

#weather3 {
    display: flex;
    justify-content: center;
    align-items: center;
}

.sideBar.left>.opration-handler {
    color: #20B0CB;
    right: -4px;
    position: absolute;
    top: 49%;
    cursor: pointer;
    z-index: 9999;
    font-size: 24px;
}

.sideBar.right>.opration-handler {
    color: #20B0CB;
    left: -4px;
    position: absolute;
    top: 49%;
    cursor: pointer;
    z-index: 9999;
    font-size: 24px;
}

.sideBar.left>.opration-handler:focus,
.sideBar.left>.opration-handler:hover {
    color: rgba(255, 255, 255, 1.0);
}

.sideBar.right>.opration-handler:focus,
.sideBar.right>.opration-handler:hover {
    color: rgba(255, 255, 255, 1.0);
}

//透明化整体
.table-wrapper /deep/ .el-table,
.el-table__expanded-cell {
    background-color: transparent !important;
}

//透明化行、单元格,删除表头下横线
.table-wrapper /deep/ tr,
.table-wrapper /deep/ th,
.table-wrapper /deep/ td {
    background: #1439391c !important;
    color: #fff;
    border-bottom: 0px; //删除表头下横线
}

//hover时样式
.table-wrapper /deep/ .el-table tbody tr:hover>td {
    background-color: #367f7f78 !important
}

// 表格内容(有用)
.table-wrapper /deep/ .el-table__row {
    background: #1439391c !important;
    color: #46d4ff;
}

.el-pagination /deep/ button {
    background: #1439391c !important;
    color: #b3c3c8;
}

.el-pagination /deep/ li {
    background: #1439391c !important;
    color: #b3c3c8;
}

.el-button {
    background: rgba(32, 160, 255, 0.2) !important;
    color: #e1e1e1;
}

::v-deep .el-input__inner {
    background-color: transparent;
}

::v-deep .el-select-dropdown__item {
    color: #fff;
}

::v-deep .el-scrollbar,
::v-deep .el-select-dropdown {
    background-color: transparent !important;
    color: #fff !important;
}

::v-deep .el-scrollbar__wrap,
::v-deep .el-select-dropdown__list {
    background-color: #2054bd2a;
    color: #fff !important;
}

::v-deep .el-select-dropdown__item.hover,
.el-select-dropdown__item:hover {
    background-color: rgba(0, 0, 0, 0.3);
    color: #fff;
}

// ::v-deep .el-pagination__jump{
//     visibility: hidden;
// }
// .el-pagination__wrapper {

//   overflow-x: hidden;
// }








</style>

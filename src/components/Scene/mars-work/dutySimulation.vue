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
                </div>
            
                <div class="point-info">
                    <div>地点</div>
                    <div>哨塔A</div>
                    <div>哨塔B</div>
                    <div>哨塔C</div>
                </div>

                <div class="button-group">
                    <el-button icon="el-icon-video-play" circle></el-button>
                    <el-button icon="el-icon-video-pause" circle></el-button>
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

                <div class="button-group">
                    <el-button icon="el-icon-video-play" circle></el-button>
                    <el-button icon="el-icon-video-pause" circle></el-button>
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
                </div>
            
                <div class="point-info">
                    <div>地点</div>
                    <div>空中点A</div>
                    <div>空中点B</div>
                    <div>空中点C</div>
                </div>

                <div class="button-group">
                    <el-button icon="el-icon-video-play" circle></el-button>
                    <el-button icon="el-icon-video-pause" circle></el-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
        }
    },
    created(){
    },
    computed:{
    },
    methods:{
    },
}
</script>
<style scoped>
#simulationInfoWindow {
    overflow: auto;
    max-height: 580px;
    width: 400px;
    position: absolute;
    left: 50px;
    top: 100px;
    display: flex;
    flex-direction: column;
    gap: 20px; /* 设置面板之间的距离 */
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

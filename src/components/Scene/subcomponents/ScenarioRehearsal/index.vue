<template>
  <div class="dark">
    <div id="viewReset" class="infoview" style="overflow: auto; top: 10px">
      <div class="btn-group">
        <button id="btn_start" type="button" class="btn btn-primary"><i class="fa fa-play-circle-o"></i>开始</button>
        <button id="btn_pause" type="button" class="btn btn-primary btn-right5" style="display: none"><i
            class="fa fa-pause-circle-o"></i>暂停</button>
        <button id="btn_proceed" type="button" class="btn btn-primary btn-right5" style="display: none"><i
            class="fa fa-play-circle-o"></i>继续</button>
        <button id="btn_stop" type="button" class="btn btn-primary" style="display: none"><i
            class="fa fa-stopFun-circle-o"></i>停止</button>
      </div>

      <ul id="treeOverlays" style="padding: 0"></ul>
      <br />
      总时长: <span id="alltimes">0s</span> &nbsp;&nbsp;
      <br />
      当前:&nbsp;&nbsp;<span id="thisStep">无</span> &nbsp;&nbsp;
      <span id="thistimes"></span>
    </div>
  </div>
</template>





<script>

export default {
  name: "ScenarioRehearsal",
  data() {
    return {
      data: {
        isPlay:false,
        isPause:false,
        totalTimes:"",

      }
    }
  },
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




</style>

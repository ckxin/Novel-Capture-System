<template>
  <div id="wrapper">
    <div class="title">
      <h1 style="margin-top:0px">{{ title }}</h1>
    </div>
    <div class="novel-home">
      <a href="https://www.2952.cc/" target="_blank">网站首页地址：https://www.2952.cc/</a>
    </div>
    <div class="main-content">
      <div class="novel-url">
        <div class="url-text">请输入小说目录网址：</div>
        <input class="url-input" type="text" v-model="listURL">
      </div>

      <div class="novel-name">
        <div class="name-text">请输入小说名称：</div>
        <input class="name-input" type="text" v-model="novelName">
      </div>

      <div class="novel-save">
        <div class="save-text">请选择小说存储路径：</div>
        <div class="save-button">
          <button @click="chooseDir">{{dirButton}}</button>
        </div>
      </div>

      <div class="novel-cap">
        <div class="cap-text">确认信息填写正确后点击开始按钮</div>
        <button :class="capButtonFlag ? capButtonF : capButtonT" @click="capNovel" :disabled="capButtonFlag ? true : false">
          {{capButton}}
        </button>
      </div>

      <div class="cap-msg">
        <div class="msg-div">
          <div class="msg-title">
            <div class="msg-text">抓取详细信息：</div>
            <div class="msg-button" v-if="isCap">
              <button @click="capPause" class="pause-btn">
                <img :src="isPause ? continueImg : pauseImg" width="25px" height="25px">
              </button>
              <button @click="capStop" class="stop-btn">
                <img src="../../../static/img/stop.png" width="25px" height="25px">
              </button>
            </div>
          </div>
          
          <div class="msg-input" v-if="isWaitInput">等待开始</div>
          <div class="msg-input" v-if="isCapInput">{{capMsg}}</div>
          <div class="msg-input" v-if="isPauseInput">{{pauseMsg}}</div>
          <div class="msg-input" v-if="isStopInput">正在停止...</div>
        </div>
      </div>
    </div>

    <div class="mask-layer" v-if="alertFlag">
      <div class="alert-main">
        <div class="close-button">
          <button @click="closeAlert">×</button>
        </div>
        <div class="alert-content">
          <div class="alert-text">请检查上述信息是否填写正确！</div>
          <div class="alert-button">
            <button @click="closeAlert">确定</button>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  const ipc = require('electron').ipcRenderer;
  const path = require('path');
  const axios = require('axios');
  const cheerio = require('cheerio');
  import {service} from '../../../static/js/service';

  async function capNovelList(url) {
    try{
        let res = await service({url});
        return new Promise(resolve => {
            resolve(res.data);
        })
    } catch(err) {
        console.log("capNovel error:");
        console.log(err);
    }
  }

  export default {
    name: 'Novel',
    data() {
      return({
        title: "二九小说网小说抓取系统",
        listURL: "",
        novelName: "",
        saveDir: "",
        dirButton: "选择存储目录",
        capButton: "开始抓取",
        capButtonFlag: false,
        capButtonT: "cap-buttonT",
        capButtonF: "cap-buttonF",
        capMsg: "抓取目录...", 
        pauseMsg: "正在暂停...", 
        pauseImg: require("../../../static/img/pause.png"),
        continueImg: require("../../../static/img/continue.png"),
        remainChapters: [],
        alertFlag: false,

        isCap: false,
        isPause: false,
        isWaitInput: true,
        isCapInput: false,
        isPauseInput: false,
        isStopInput: false
      })
    },
    methods: {
      chooseDir() {
        ipc.send("choose_save_dir");
      },
      closeAlert() {
        this.alertFlag = false;
        this.isName = false;
        this.alertInfo = "";
      },

      async capNovel() {
        if(this.listURL === "" || this.novelName === "" || this.saveDir === "") {
          this.alertFlag = true;
        }
        else {
          this.capButton = "抓取中..."
          this.capButtonFlag = true;
          this.capMsg = "抓取目录...";
          this.isWaitInput = false;
          this.isCapInput = true;
          this.isPauseInput = false;
          this.isStopInput = false;
          let listURL = this.listURL;
          let novelName = this.novelName;
          let txtPath = path.join(this.saveDir, `${this.novelName}.txt`);

          // 需要改为要抓取小说网页的基础路径
          let baseURL = `${listURL.split(".cc")[0]}.cc`;
          let html = await capNovelList(listURL);
          let $ = cheerio.load(html);

          // 需要修改为抓取页面目录class或id名称
          let chapterList = $('#list a');
          let chapterNum = chapterList.length;
          let chapterLinks = [];

          // 需要确定从第几个链接开始抓取
          for(let idx=0; idx<chapterNum; idx++) {
            let tmpURL = $(chapterList[idx]).attr("href");
            tmpURL = baseURL + tmpURL;
            chapterLinks.push(tmpURL);
          }
          ipc.send("cap_novel", {txtPath, novelName, chapterLinks, status: "normal"});
          this.isCap = true;
        }
      },

      capPause() {
        this.isPause = !this.isPause;
        if(this.isPause) {
          this.pauseMsg = "正在暂停...";
          this.isWaitInput = false;
          this.isCapInput = false;
          this.isPauseInput = true;
          this.isStopInput = false;
          ipc.send("cap-pause");
        } else {
          this.isWaitInput = false;
          this.isCapInput = true;
          this.isPauseInput = false;
          this.isStopInput = false;
          let novelName = this.novelName;
          let txtPath = path.join(this.saveDir, `${this.novelName}.txt`);
          let remainChapters = this.remainChapters;
          ipc.send("cap_novel", {txtPath, novelName, remainChapters, status: "continue"});
        }
      },

      capStop() {
        this.isWaitInput = false;
        this.isCapInput = false;
        this.isPauseInput = false;
        this.isStopInput = true;
        if(this.isPause) {
          let novelName = this.novelName;
          let txtPath = path.join(this.saveDir, `${this.novelName}.txt`);
          ipc.send("cap-stop", {status: "paused", novelName, txtPath});
        }
        else
          ipc.send("cap-stop", {status: "caping"});
      }
    },
    created() {
      ipc.on("choose-finished", (e, saveDir) => {
        if(saveDir !== null){
          this.saveDir = saveDir[0];
          this.dirButton = saveDir[0];
        }
      });

      ipc.on("cap-started", (e, arg) => {
        this.capMsg = arg;
      });
      ipc.on("cap-continued", (e, arg) => {
        this.capMsg = arg;
      });

      ipc.on("chapter-finished", (e, arg) => {
        this.capMsg = arg;
      });

      ipc.on("cap-finished", (e, arg) => {
        this.capMsg = arg;
        this.capButton = "开始抓取";
        this.capButtonFlag = false;
        this.isCap = false;
      });

      ipc.on("cap-paused", (e, arg) => {
        this.remainChapters = arg.remainChapters;
        this.pauseMsg = "暂停中...";
      })

      ipc.on("cap-stoped", (e) => {
        this.listURL = "";
        this.novelName = "";
        this.saveDir = "";
        this.dirButton = "选择存储目录";
        this.capButton = "开始抓取";
        this.capButtonFlag = false;
        this.isCap = false;
        this.isWaitInput = true;
        this.isCapInput = false;
        this.isPauseInput = false;
        this.isStopInput = false;
      })
    }
  }
</script>

<style>
  #wrapper {
    text-align: center;
    color: white;
    position: relative;
    top: 8%;
  }
  .title {
    padding-top: 10px;
  }

  .novel-home a{
    color: grey;
    font-size: 20px;
    text-decoration: none;
    font-style: italic;
  }

  .main-content {
    width: 100%;
    text-align: center;
    margin-top: 20px;
  }

  .novel-url {
    width: 100%;
    height: 35px;
  }
  .url-text {
    height: 35px;
    width: 280px;
    text-align: left;
    vertical-align: middle;
    display: inline-block;
    font-size: 28px;
  }
  .url-input {
    width: 450px;
    height: 35px;
    display: inline-block;
    vertical-align: middle;
    font-size: 20px;
    padding: 0 0 0 5px;
    border: 0px;
    border-radius: 5px;
    outline: none;
  }

  .novel-name {
    width: 100%;
    height: 35px;
    margin-top: 20px;
  }
  .name-text {
    height: 35px;
    width: 280px;
    text-align: left;
    display: inline-block;
    vertical-align: middle;
    font-size: 28px;
  }
  .name-input {
    width: 450px;
    height: 35px;
    display: inline-block;
    vertical-align: middle;
    font-size: 20px;
    padding: 0 0 0 5px;
    border: 0px;
    border-radius: 5px;
    outline: none;
  }

  .novel-save {
    width: 100%;
    height: 35px;
    margin-top: 20px;
  }
  .save-text {
    height: 35px;
    width: 280px;
    text-align: left;
    display: inline-block;
    vertical-align: middle;
    font-size: 28px;
  }
  .save-button {
    width: 455px;
    height: 35px;
    text-align: left;
    display: inline-block;
    vertical-align: middle;
    border: 0px;
    border-radius: 5px;
  }
  .save-button button {
    height: 35px;
    width: 455px;
    font-size: 20px;
    margin:0px;
    outline: none;
    border: 0;
    border-radius: 5px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .save-button button:hover {
    background: grey;
    color: white;
  }

  .novel-cap {
    width: 100%;
    height: 45px;
    margin-top: 50px;
  }
  .cap-text {
    height: 45px;
    width: 525px;
    text-align: left;
    display: inline-block;
    vertical-align: middle;
    font-size: 32px;
  }
  .cap-buttonT {
    height: 45px;
    width: 210px;
    background: #28a745;
    font-size: 30px;
    font-weight: bold;
    color: white;
    margin:0px;
    padding: 0;
    outline: none;
    border: 0;
    border-radius: 5px;
  }
  .cap-buttonT:hover {
    background: grey;
  }
  .cap-buttonF {
    height: 45px;
    width: 210px;
    background: #999;
    opacity: .65;
    font-size: 30px;
    font-weight: bold;
    color: white;
    margin:0px;
    padding: 0;
    outline: none;
    border: 0;
    border-radius: 5px;
  }

  .cap-msg {
    width: 100%;
    margin-top: 50px;
  }
  .msg-div {
    width: 735px;
    height: 80px;
    margin: 0 auto;
    padding: 5px;
    border: 1px solid grey;
    border-radius: 5px;
  }
  .msg-title {
    height: 30px;
    width: 100%;
    text-align: left;
    margin-bottom: 10px;
    vertical-align: top
  }
  .msg-text {
    height: 30px;
    width: 400px;
    /* width: 725px; */
    display: inline-block;
    text-align: left;
    vertical-align: top;
    font-size: 25px;
  }
  .msg-button {
    height: 30px;
    width: 320px;
    display: inline-block;
    padding-right: 5px;
    text-align: right;
  }
  .msg-button button {
    height: 30px;
    width: 30px;
    padding: 0;
    margin: 0;
    border: none;
    outline: none;
    background: #343a40;
  }
  .pause-btn:hover {
    background: grey;
  }
  .stop-btn:hover {
    background: red;
  }

  .msg-input {
    width: 710px;
    height: 30px;
    padding-left: 15px;
    text-align: left;
    outline: none;
    border: 0;
    background: #343a40;
    font-size: 20px;
    color: grey;
  }


  .mask-layer {
    height: 100%;
    width: 100%;
    background:rgba(0,0,0,0.8);
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .alert-main {
    height: 200px;
    width: 350px;
  }

  .close-button {
    width: 350px;
    height: 30px;
    background: grey;
    border: 0px solid #343a40;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    text-align: right;
  }

  .close-button button {
    height: 30px;
    width: 30px;
    outline: none;
    margin: 0;
    padding: 0;
    border: 0;
    background: none;
    color: white;
    font-size: 25px;
  }

  .close-button button:hover {
    background: #dc3545;
  }

  .alert-content {
    width: 350px;
    height: 170px;
    background: #E0E0E0;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }

  .alert-text {
    width: 100%;
    height: 30px;
    position: relative;
    top: 50px;
    font-size: 20px;
    color: #181818;
  }

  .alert-button {
    width: 100%;
    height: 30px;
    position: relative;
    top: 65px;
    text-align: right;
  }
  .alert-button button {
    width: 80px;
    height: 40px;
    background: #B8B8B8;
    margin-right: 15px;
    padding: 0;
    border: 0px solid;
    border-radius: 5px;
    outline: none;
    font-size: 20px;
    color: #181818;
  }
  .alert-button button:hover {
    background: #A0A0A0;
  }

</style>

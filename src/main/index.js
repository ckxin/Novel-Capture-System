import { app, BrowserWindow, dialog, ipcMain, shell } from 'electron'
const fs = require("fs");
const iconv = require('iconv-lite');
const cheerio = require('cheerio');

import {service} from '../../static/js/service';

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 600,
    useContentSize: true,
    width: 900,
    webPreferences: {
      nodeIntegration: true,
	    webSecurity: false
    },
    resizable: false
  })

  mainWindow.loadURL(winURL)
  mainWindow.setMenu(null);

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('web-contents-created', (e, webContents) => {
  webContents.on('new-window', (event, url) => {
      event.preventDefault();
      shell.openExternal(url);
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on("choose_save_dir", e => {
  dialog.showOpenDialog({
    title: "选择小说保存路径",
    defaultPath: "/",
    filters: [{name:'Txt', extensions:["txt"]}],
    properties:['openDirectory']
  }, saveDir => {
    e.sender.send('choose-finished', saveDir);
  })
})



async function capNovel(url) {
  try{
      let res = await service({url});
      return new Promise(resolve => {
          const chunks = [];
          res.data.on("data", (chunk) => {
              chunks.push(chunk);
          });
          res.data.on("end", () => {
              const buf = Buffer.concat(chunks);

               // 需要注意抓取的网页编码方式是否为"gbk"    
              const str = iconv.decode(buf, 'gbk');
              resolve(str) ;
          })
      })
  } catch(err) {
      console.log("capNovel error:");
      console.log(err);
  }
}


var cap_status = "";
ipcMain.on("cap-stop", (e, arg) => {
  if(arg.status === "paused"){
    let novelName = arg.novelName;
    let txtPath = arg.txtPath;
    fs.unlinkSync(txtPath, `《${novelName}》\n`);
    e.sender.send("cap-stoped");
    return;
  }
  else
    cap_status = "stop";
});
ipcMain.on("cap-pause", e => {
  cap_status = "pause";
})

ipcMain.on("cap_novel", async (e, arg) => {
  // console.time("get");
  let txtPath = arg.txtPath;
  let novelName = arg.novelName;
  let chapterLinks = [];
  if(arg.status === "normal") {
    fs.writeFileSync(txtPath, `《${novelName}》\n`);
    chapterLinks = arg.chapterLinks;
    e.sender.send("cap-started", "开始抓取小说章节内容");
  } else if(arg.status === "continue") {
    chapterLinks = arg.remainChapters;
    e.sender.send("cap-continued", "继续抓取小说");
  }
  
  let linkNumber = chapterLinks.length;
  for(let i=0; i<linkNumber; i++){
      if(cap_status === "stop") {
        fs.unlinkSync(txtPath, `《${novelName}》\n`);
        e.sender.send("cap-stoped");
        cap_status = "";
        return;
      }
      if(cap_status === "pause") {
        let remainChapters = chapterLinks.slice(i);
        e.sender.send("cap-paused", {remainChapters});
        cap_status = "";
        return;
      }
      else {
        let chapterURL = chapterLinks[i];
        let chapterHTML = await capNovel(chapterURL);
        let $$ = cheerio.load(chapterHTML);

        // 需要改为抓取页面标题截断方式
        let title = $$('title').text().split('_')[0];
        if(title.includes("第"))
            title = `第${title.split("第")[1]}`
        fs.appendFileSync(txtPath, `${title}\n`);
        let chapter = [];

        // 需要改为抓取页面内容所在div的id以及注意该页面换行方式
        let data = $$('div[id="content"] br');
        data.each((idx, ele) => {
          if(idx === 0) {
            if(ele.prev.type === "text"){
                chapter.push(ele.prev.data);
            }
          }
          else if(ele.next.type === "text"){
            chapter.push(ele.next.data);
          }    
        })
        chapter.forEach((val, idx, arr) => {
            fs.appendFileSync(txtPath, `${val}\n`);
        });
        fs.appendFileSync(txtPath, "\n");
        let chapter_msg = `${title} 抓取成功！`;
        e.sender.send("chapter-finished", chapter_msg);
      }  
  }
  e.sender.send("cap-finished", "小说抓取完毕！");
  // console.timeEnd("get");
})


/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */

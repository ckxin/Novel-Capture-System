#1.简介
&nbsp;&nbsp;&nbsp;&nbsp;这是一款基于Electron-Vue的桌面应用程序。
&nbsp;&nbsp;&nbsp;&nbsp;应用链接地址为：https://github.com/ckxin/Novel-Capture-System.git
&nbsp;&nbsp;&nbsp;&nbsp;该应用利用JS爬虫可以对二九小说网里的小说进行抓取并保存到本地。抓取速度取决于你当前的网速和该网站服务器当前状态。软件界面如下图所示：

![Interface](https://upload-images.jianshu.io/upload_images/21331495-f34a49a69e39df9b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/600)

#2.使用方法
###下面我们以《微微一笑很倾城》这本小说为例，介绍一下具体使用方法：
**1)输入小说目录网址**
&nbsp;&nbsp;&nbsp;&nbsp;点击网站首页地址打开该小说网站，搜索要抓取的小说打开目录页，将**目录网址**复制粘贴到对应**小说目录网址输入框**。如下图所示：

![单击打开首页](https://upload-images.jianshu.io/upload_images/21331495-b7c2d52b3cb8dc46.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/600)

![输入书名搜索](https://upload-images.jianshu.io/upload_images/21331495-ff970a0705e49bda.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/600)

![小说目录页](https://upload-images.jianshu.io/upload_images/21331495-7c00417b7d7e4866.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/600)

![粘贴小说目录网址](https://upload-images.jianshu.io/upload_images/21331495-3d81c6c3f39ad02a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/600)

**2)输入小说名称**
&nbsp;&nbsp;&nbsp;&nbsp;比如我们要下载的是《微微一笑很倾城》，就在对应**小说名称输入框**输入**微微一笑很倾城**，如下图所示：

![输入或粘贴小说名称](https://upload-images.jianshu.io/upload_images/21331495-ccb35f6d110c5a3e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/600)

**3)选择存储路径**
&nbsp;&nbsp;&nbsp;&nbsp;点击**选择存储目录**按钮，选择你要存储的目录。

![选择小说存储路径](https://upload-images.jianshu.io/upload_images/21331495-252f2843723ac5bd.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/600)

&nbsp;&nbsp;&nbsp;&nbsp;选择完成后，该按钮会**显示你选择的路径**。

![显示路径](https://upload-images.jianshu.io/upload_images/21331495-72c513b3d7456988.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/600)


**4)开始抓取小说**
&nbsp;&nbsp;&nbsp;&nbsp;确认以上信息**全部填写正确**后，点击**开始抓取**按钮，即可开始抓取小说。

![开始抓取](https://upload-images.jianshu.io/upload_images/21331495-a03540517841aa69.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/600)

*注意：请确保小说目录网址填写正确，否则可能出现网络错误*

&nbsp;&nbsp;&nbsp;&nbsp;抓取开始后**开始抓取**按钮会被**禁用**(即禁止再次点击)，并切换为**抓取中...**，直到该小说**成功抓取完毕或人为停止任务**才会恢复。

![按钮禁用](https://upload-images.jianshu.io/upload_images/21331495-7ce096de57abc4b9.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/600)

**5)抓取过程**

&nbsp;&nbsp;&nbsp;&nbsp;开始抓取后下方**抓取详细信息**出会出现抓取过程**当前状态**：

![抓取状态1](https://upload-images.jianshu.io/upload_images/21331495-30471219386eeaab.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/600)
![抓取状态2](https://upload-images.jianshu.io/upload_images/21331495-64eee61b61554b0e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/600)

&nbsp;&nbsp;&nbsp;&nbsp;抓取详细信息区域有两个按钮，一个是**暂停**按钮，一个是**关闭**(停止)按钮。

![暂停和结束按钮](https://upload-images.jianshu.io/upload_images/21331495-df2e5d544190b827.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/600)

&nbsp;&nbsp;&nbsp;&nbsp;点击**暂停**按钮会**暂停抓取**过程，并将暂停按钮转变为**继续**按钮。

![暂停状态与继续按钮](https://upload-images.jianshu.io/upload_images/21331495-9eda98cebdfae714.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/600)

&nbsp;&nbsp;&nbsp;&nbsp;点击**继续**按钮将会继续先前的抓取过程：

![继续抓取](https://upload-images.jianshu.io/upload_images/21331495-a5d77300e1d17400.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/600)

&nbsp;&nbsp;&nbsp;&nbsp;点击**关闭**(停止)按钮会**结束**当前抓取任务**并清空**已抓取内容，并将系统初始化。

![停止任务](https://upload-images.jianshu.io/upload_images/21331495-250854d807c94aeb.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/600)

![初始化系统](https://upload-images.jianshu.io/upload_images/21331495-57f75aa992db837f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/600)

**6)任务完成**
&nbsp;&nbsp;&nbsp;&nbsp;任务完成后会显示**小说抓取完毕！**状态，并恢复**开始抓取**按钮。

![抓取完成](https://upload-images.jianshu.io/upload_images/21331495-57c6d5a3f205e9de.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/600)

#3.错误及应对方式
&nbsp;&nbsp;&nbsp;&nbsp;暂时还未遇到错误，但有可能会由于网速或小说网站服务器的原因出现以下错误：
&nbsp;&nbsp;&nbsp;&nbsp;**错误1：**抓取状态长时间不发生改变，好像系统卡住了。
&nbsp;&nbsp;&nbsp;&nbsp;**解决方法：**检查本机网络是否出现问题，打开相应小说目录页或章节页查看小说网站是否出现问题。若均没有问题，可选择继续等待，等系统重新请求小说网站成功后即会继续抓取。或：首先点击暂停按钮，然后点击关闭按钮取消任务，并重新开始。
*注：此时可能无法暂停成功，不用管，依次点击暂停和关闭按钮就好，具体原因参照：错误2*

&nbsp;&nbsp;&nbsp;&nbsp;**错误2：**抓取过程中**无法暂停或停止成功**。即点击暂停按钮**状态栏**总显示**正在暂停...**却无法切换到**暂停中...**从而暂停成功，或点击关闭按钮总显示**正在停止...**却无法停止成功。
&nbsp;&nbsp;&nbsp;&nbsp;**原因：**系统在抓取过程中总是在**完成当前章节抓取后**才会响应暂停或关闭事件。当系统正在请求某一章节却无法请求成功从而不断**重新请求**时，就会导致当前无法响应暂停或关闭事件。
&nbsp;&nbsp;&nbsp;&nbsp;**解决办法：**可能还是网络问题，参考**错误1**解决办法检查网络是否出现问题。若网络无问题，则继续以下步骤：此时若只是想暂停，则点击完暂停按钮后等待状态转换即可，当系统重新请求成功时就会暂停成功。若是想停止任务，则参考**错误1**解决办法，依次点击暂停，关闭按钮即可。
*注：我设置了暂停状态下强行停止任务的方法，因此依次点击暂停和停止按钮即可停止任务，但注意，此操作同样会清空已完成内容，并不可逆，慎点。*

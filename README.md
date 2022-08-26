# fastCanvas

一个方便微信小程序快速创建**自适应 canvas-2d**的库

主要用于微信海报生成、拼接二维码等功能;

## Usage

### 安装

1、 直接下载拷贝到你的项目目录。

2、 npm 安装

```bash
npm i wx-fastcanvas --save
```

_注意：下载完成后，记得利用微信开发者工具进行构建 npm_

### 引入

```js
import Fastcanvas from 'wx-fastcanvas'
```

### 调用

#### 1、初始化

注意： 该库中所有的 api 传入的尺寸均为您**设计稿上的尺寸**，
所以需要您在初始化的时候传入设计稿上的屏幕宽度以便于动态计算 canvas 及其元素的尺寸，达到自适应的效果；

```html
<!-- wxml  -->
<canvas type="2d" id="myCanvas" style="width: 706rpx; height:946rpx"></canvas>
```

```js
//js
const myCanvas = await new Fastcanvas().init({
  id: '#myCanvas', //必须，<canvas>标签的id
  UIwidth: '750', // 必须，设计稿的宽度，比如750
  width: '706', // 必须，canvas的宽度
  height: '946', // 必须，canvas的高度
})
```

#### 2、绘制 canvas

- api: `draw(arr)`

- @params{arr} : 传入一个即将绘制的对象数组，fastCanvas 会按照顺序进行绘制

- @return {Object} 返回 canvas 实例的引用，并且可以通过 returnObj.ctx 来访问 canvas 的 contxt

example：

```js
myCanvas.draw([
  {
    type: "img",
    src: "../../images/codeBg.png",
    x: 0,
    y: 0,
    width: 706,
    height: 946,
},{
    type: "text",
    content: '这里是要输入的文字',
    x: 350,
    y: 370,
    font: "normal normal bold 36px arial,sans-serif",
    textAlign: "center",
}]
```

- 绘制图片

  ```js
      {
        type: "img", //必须, 绘制类型
        src: "../../images/codeBg.png",  //必须,图片地址，支持本地图片、远程图片、临时图片地址
        x: 0, //绘制对象左上角的x坐标，非必须，默认为0
        y: 0, //绘制对象左上角的y坐标，非必须，默认为0
        width: 706, // 绘制对象的宽度，非必须，默认250
        height: 946, // 绘制对象的高度，非必须，默认250
      }
  ```

- 绘制圆角图片

 ```js
      {
        type: "img", 
        src: "../../images/codeBg.png",  
        x: 0, 
        y: 0, 
        width: 706, 
        height: 946, 
        radius: 10, // 增加圆角参数即可
      }
  ```

- 绘制文字

  ```js
    {
      type: "text", //绘制类型，必须
      content: '这里是要输入的文字', // 必须，绘制内容
      x: 350, //绘制对象左上角的x坐标，非必须，默认为0
      y: 370, //绘制对象左上角的y坐标，非必须，默认为0
      font: "normal normal bold 36px arial,sans-serif", //非必须，规则参考css font属性
      textAlign: "center", // 非必须，对齐方式，注意：对齐基线以（x，y)坐标为准，具体可参考canvas文档
    }
  ```

- 绘制二维码

  ```js
    {
      type: "qrcode", //必须, 绘制类型
      content: 'https://github.com/bigdots/wx-fastCanvas', //必须, 转化为二维码的内容
      x: 253, //绘制对象左上角的x坐标，非必须，默认为0
      y: 400, //绘制对象左上角的x坐标，非必须，默认为0
      width: 200, //绘制对象左上角的x坐标，非必须，默认为250
      height: 200, //绘制对象左上角的x坐标，非必须，默认为250
    }
  ```

**功能还在完善中，目前只支持图片、文字和二维码这三种常用功能的绘制**

**与原生写法完全兼容，你可以通过`myCanvas.canvas`、`myCanvas.ctx`访问 canvas 实例 和 canvs 的上下文 来扩充任何绘制**

## 3、其他功能

- 返回 canvas 的临时路径

```js
await myCanvas.getTempFilePath()
// console.log(myCanvas.tempFilePath)
```

- 下载 canvas

```js
myCanvas.downLoad()
```

## 注意

由于精力有限，此项目未做大量版本测试，本人使用的微信小程序基本库为2.19.6
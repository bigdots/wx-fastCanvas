# fastCanvas

一个方便微信小程序快速创建 canvas 的库

主要用于微信海报、二维码的动态生成

## Usage

### 安装

1、 直接下载拷贝到你的项目目录。

2、 npm 安装

### 引入

```js
import fastCanvas from "projectName/index";
```

### 调用

1、初始化

```html
//wxml
<canvas type="2d" id="myCanvas"></canvas>
```

```js
//js
const myCanvas = await new simpleCanvas().init({
  id: '#myCanvas',
  UIwidth: '750', // 设计稿的宽度，比如750，方便计算
  width: '706', // canvas的宽度
  height: '946', // canvas的高度
})
```

2、绘制\_·myCanvas.draw(array)·

功能还在完善中，目前只支持图片和文字这两种常用功能的绘制

```js
myCanvas.draw([
  {
    type: "img", //绘制类型，必须
    src: "../../images/codeBg.png",  //图片地址，type为img时，必须
    x: 0, //绘制对象左上角的x坐标，必须
    y: 0, //绘制对象左上角的y坐标，必须
    width: 706, // 绘制对象的宽度，必须
    height: 946, // 绘制对象的高度，必须
},{
    type: "text", //绘制类型，必须
    content: '这里是要输入的文字',
    x: 350,
    y: 370,
    font: "normal normal bold 36px arial,sans-serif", //非必须，规则参考css font属性
    textAlign: "center", // 对其方式，对其基线以x坐标为准，非必须
}]
```

3、其他功能

- 返回 canvas 的临时路径

```js
myCanvas.getTempFilePath()
// console.log(myCanvas.tempFilePath)
```

- 下载 canvas

```js
myCanvas.downLoad()
```

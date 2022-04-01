# fastCanvas

一个方便微信小程序快速创建**自适应 canvas**的库

主要用于微信海报生成、拼接二维码等功能;

## Usage

### 安装

1、 直接下载拷贝到你的项目目录。

2、 npm 安装

```bash
npm i wx-fastcanvas
```

下载完成后，利用微信开发者工具进行构建 npm

### 引入

```js
import Fastcanvas from 'wx-fastcanvas'
```

### 调用

1、初始化

该库中所有的 api 传入的尺寸均为您**设计稿上的尺寸**，
所以需要您在初始化的时候传入设计稿上的屏幕宽度以便于动态计算 canvas 及其元素的尺寸，达到自适应的效果；

```html
<!-- wxml  -->
<canvas type="2d" id="myCanvas"></canvas>
```

```js
//js
const myCanvas = await new Fastcanvas().init({
  id: '#myCanvas',
  UIwidth: '750', // 设计稿的宽度，比如750
  width: '706', // canvas的宽度
  height: '946', // canvas的高度
})
```

2、绘制

- api: `draw(Array)`

- Array: 传入一个即将绘制的对象数组，fastCanvas 会按照顺序进行绘制

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

**功能还在完善中，目前只支持图片和文字这两种常用功能的绘制**

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

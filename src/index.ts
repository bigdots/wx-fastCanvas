import drawQrcode from './drawCode'
import Img from "./basic/Img"
import Txt from "./basic/Txt"

class FastCanvas {
  ctx:object = {}
  ratio:number = 0
  canvas:object = {}
  tempFilePath:string = ''
  constructor() {
    
  }
  static async init(obj) {
    // console.log(obj)
    const instance = new FastCanvas()
    //dpr设备像素比，物理像素与css像素的比值
    const { pixelRatio: dpr, screenWidth } = wx.getSystemInfoSync()
    // 屏幕与设计稿的比值
    const ScreenUiratio = screenWidth / obj.UIwidth
    instance.ratio = ScreenUiratio * dpr
    const nodes = await instance.getCanvasNode(obj.id)
    instance.canvas = nodes[0].node
    instance.canvas.width = obj.width * instance.ratio
    instance.canvas.height = obj.height * instance.ratio
    instance.ctx = this.canvas.getContext('2d')
    return instance
  }

  async downLoad() {
    this.saveCanvasToPhotosAlbum(this.canvas)
    return this
  }

  async getTempFilePath() {
    // 下载到本地临时文件
    const res = await wx.canvasToTempFilePath(
      {
        canvas: this.canvas,
      },
      this
    )
    this.tempFilePath = res.tempFilePath
    return this
  }

  async saveCanvasToPhotosAlbum(canvas) {
    try {
      // 处理授权
      const setting = await wx.getSetting()
      if (!setting.authSetting['scope.writePhotosAlbum']) {
        // 授权写入相册权限
        await wx.authorize({ scope: 'scope.writePhotosAlbum' })
      }
      wx.showLoading({
        title: '下载中',
      })
      // 下载到本地临时文件
      const downRes = await wx.canvasToTempFilePath(
        {
          canvas,
        },
        this
      )

      // 写入相册
      await wx.saveImageToPhotosAlbum({
        filePath: downRes.tempFilePath,
      })

      wx.hideLoading()
    } catch (e) {
      console.error(e)
      wx.showToast({
        icon: 'none',
        title: '保存图片失败',
      })
    }
    return this
  }

  

  private getCanvasNode(selector) {
    return new Promise((resolve, reject) => {
      const query = wx.createSelectorQuery()
      query.select(selector).fields({ node: true, size: true })
      query.exec((res) => {
        resolve(res)
      })
    })
  }

  async draw(arr) {
    //   const {} = this;
    // console.log(this)
    for (let i = 0; i < arr.length; i++) {
      const ele = arr[i]
      // 遍历所有的数值，进行设备适配
      Object.keys(ele).forEach((key) => {
        // console.log(key, ele[key]);
        if (typeof ele[key] === 'number') {
          ele[key] = ele[key] * this.ratio
        }
      })

      // 默认值
      const x = ele.x ? ele.x : 0
      const y = ele.y ? ele.y : 0
      const width = ele.width ? ele.width : 250
      const height = ele.height ? ele.height : 250

      if (ele.type == 'img') {
        // console.log(ele.src)
        // const img = await this.imageLoad(ele.src)
        // this.ctx.drawImage(img, x, y, width, height)
        new Img(this.ctx,this.canvas).draw(ele,x, y, width, height)
      }
      if (ele.type == 'text') {
        // this.ctx.font = `normal normal bold 30px arial,sans-serif`;
        // if (ele.font) {
        //   this.ctx.font = ele.font.replace(/(\d)+/g, (macth) => {
        //     return macth * this.ratio
        //   })
        // }
        // if (ele.textAlign) {
        //   this.ctx.textAlign = ele.textAlign
        // }
        // if (ele.fillStyle) {
        //   this.ctx.fillStyle = ele.fillStyle
        // }

        // this.ctx.fillText(ele.content, x, y)
        new Txt(this.ctx,this.canvas).draw(ele)
      }

      if (ele.type == 'qrcode') {
        drawQrcode({
          ctx: this.ctx,
          x,
          y,
          width,
          height,
          text: ele.content,
        })
      }
    }

    return this
  }
}

export default FastCanvas

import Img from './basic/Img'
import Txt from './basic/Txt'
import { CanvasParam } from './utils/Interface'
import { Type } from './utils/enums'

class FastCanvas {
  ctx: any
  ratio: number
  canvas: any
  tempFilePath: string
  constructor() {}
  static async init(obj: CanvasParam) {
    // console.log(obj)
    const instance = new FastCanvas()
    //dpr设备像素比，物理像素与css像素的比值
    const { pixelRatio: dpr, screenWidth } = wx.getSystemInfoSync()
    // 屏幕与设计稿的比值
    const ScreenUiratio = screenWidth / obj.UIwidth
    instance.ratio = ScreenUiratio * dpr
    // 设置canvas的信息并挂载到实例上
    const nodes: any = await instance.getCanvasNode(obj.id)
    instance.canvas = nodes[0].node
    instance.canvas.width = obj.width * instance.ratio
    instance.canvas.height = obj.height * instance.ratio
    instance.ctx = instance.canvas.getContext('2d')
    return instance
  }

  async downLoad() {
    this.saveCanvasToPhotosAlbum()
    return this
  }
  calcSize(ele: any) {
    Object.keys(ele).forEach((key) => {
      if (typeof ele[key] === 'number') {
        ele[key] = ele[key] * this.ratio
      }
    })
    return ele
  }

  async getTempFilePath() {
    // 下载到本地临时文件
    const res = await wx.canvasToTempFilePath({
      canvas: this.canvas,
    })
    this.tempFilePath = res.tempFilePath
    return this
  }

  async saveCanvasToPhotosAlbum() {
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
      const downRes = await wx.canvasToTempFilePath({
        canvas: this.canvas,
      })

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

  private getCanvasNode(selector: string) {
    return new Promise((resolve: Function, reject: Function) => {
      const query = wx.createSelectorQuery()
      query.select(selector).fields({ node: true, size: true })
      query.exec((res) => {
        resolve(res)
      })
    })
  }

  async paint(arr: any[]) {
    for (let i = 0; i < arr.length; i++) {
      // 遍历所有的数值，进行设备适配
      const ele = this.calcSize(arr[i])

      if (ele.type == Type.Img) {
        // console.log(ele.src)
        // const img = await this.imageLoad(ele.src)
        // this.ctx.drawImage(img, x, y, width, height)
        new Img().draw(ele)
      }
      if (ele.type == Type.Txt) {
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
        new Txt().draw(ele)
      }

      if (ele.type == Type.Qrcode) {
      }
    }

    return this
  }
}

export default FastCanvas

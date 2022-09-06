// import drawQrcode from './drawCode'

import QRCode from 'qrcode'

class FastCanvas {
  constructor() {}
  async init(obj) {
    // console.log(obj)
    //dpr设备像素比，物理像素与css像素的比值
    const { pixelRatio: dpr, screenWidth } = wx.getSystemInfoSync()
    // 屏幕与设计稿的比值
    const ScreenUiratio = screenWidth / obj.UIwidth
    this.ratio = ScreenUiratio * dpr
    const nodes = await this.getCanvasNode(obj.id)
    this.canvas = nodes[0].node
    this.canvas.width = obj.width * this.ratio
    this.canvas.height = obj.height * this.ratio

    // console.debug(obj, obj.width * this.ratio, this.canvas)

    this.ctx = this.canvas.getContext('2d')
    return this
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

  imageLoad(url) {
    return new Promise((resolve, reject) => {
      const img = this.canvas.createImage()
      img.src = url
      img.onload = () => {
        resolve(img)
      }
      img.onerror = () => {
        reject('图片加载失败')
      }
    })
  }

  getCanvasNode(selector) {
    return new Promise((resolve, reject) => {
      const query = wx.createSelectorQuery()
      query.select(selector).fields({ node: true, size: true })
      query.exec((res) => {
        resolve(res)
      })
    })
  }

  async draw(arr) {
    for (let i = 0; i < arr.length; i++) {
      const ele = arr[i]
      console.debug('1234', ele)
      // 遍历所有的数值，进行设备适配
      Object.keys(ele).forEach((key) => {
        // console.log(key, ele[key]);
        if (typeof ele[key] === 'number') {
          ele[key] = ele[key] * this.ratio
        }
      })

      // 默认值
      ele.x = ele.x ? ele.x : 0
      ele.y = ele.y ? ele.y : 0
      ele.width = ele.width ? ele.width : 250
      ele.height = ele.height ? ele.height : 250

      switch (ele.type) {
        case 'img':
          await this.drawImg(ele)
          break
        case 'text':
          this.drawText(ele)
          break
        case 'qrcode':
          await this.drawQrcode(ele)
          break
        default:
          break
      }
    }

    return this
  }

  async drawQrcode(ele) {
    const { x, y, width, height, content } = ele
    // 创建离屏 2D canvas 实例
    const canvas = wx.createOffscreenCanvas({
      type: '2d',
      width,
      height,
    })
    const dataUrl = await QRCode.toDataURL(canvas, content)
    const img = await this.imageLoad(dataUrl)
    this.ctx.drawImage(img, x, y, width, height)
  }

  drawText(ele) {
    const { x, y, font, textAlign, fillStyle, content } = ele
    // this.ctx.font = `normal normal bold 30px arial,sans-serif`;
    if (font) {
      this.ctx.font = font.replace(/(\d)+/g, (macth) => {
        return macth * this.ratio
      })
    }
    if (textAlign) {
      this.ctx.textAlign = textAlign
    }
    if (fillStyle) {
      this.ctx.fillStyle = fillStyle
    }

    this.ctx.fillText(content, x, y)
  }

  async drawImg(ele) {
    const { x, y, width, height, src, radius } = ele
    let url
    if (radius) {
      url = await this.createRadiusImg(ele)
    } else {
      url = src
    }

    const img = await this.imageLoad(url)
    this.ctx.drawImage(img, x, y, width, height)
  }

  async createRadiusImg(ele) {
    const { x, y, width, height, radius, src } = ele
    // 创建离屏 2D canvas 实例
    const canvas = wx.createOffscreenCanvas({
      type: '2d',
      width,
      height,
    })

    // 绘制圆角矩形
    const ctx = canvas.getContext('2d')
    ctx.beginPath()
    ctx.arc(width - radius, height - radius, radius, 0, Math.PI / 2)
    ctx.lineTo(radius, height)
    ctx.arc(radius, height - radius, radius, Math.PI / 2, Math.PI)
    ctx.lineTo(0, radius)
    ctx.arc(radius, radius, radius, Math.PI, (Math.PI * 3) / 2)
    ctx.lineTo(width - radius, 0)
    ctx.arc(width - radius, radius, radius, (Math.PI * 3) / 2, Math.PI * 2)
    ctx.closePath()

    // 画布裁切
    ctx.clip()

    // 绘画图片
    const img = await this.imageLoad(src)
    ctx.drawImage(img, 0, 0, width, height)

    // 获取临时地址
    const res = await wx.canvasToTempFilePath({
      canvas: canvas,
    })

    console.debug('res', res.tempFilePath)

    return res.tempFilePath
  }
}

export default FastCanvas

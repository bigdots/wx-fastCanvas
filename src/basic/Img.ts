import FastCanvas from '../index'

export default class Img extends FastCanvas {
  constructor() {
    super()
  }
  private imageLoad(url: string) {
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
  async draw(ele: any) {
    // 默认值
    const x = ele.x ? ele.x : 0
    const y = ele.y ? ele.y : 0
    const width = ele.width ? ele.width : 250
    const height = ele.height ? ele.height : 250

    const img = await this.imageLoad(ele.src)
    this.ctx.drawImage(img, x, y, width, height)
  }
}

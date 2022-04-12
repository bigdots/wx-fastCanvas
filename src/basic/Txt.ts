import FastCanvas from '../index'

export default class Txt extends FastCanvas {
  constructor() {
    super()
  }
  draw(ele: any) {
    // 默认值
    const x = ele.x ? ele.x : 0
    const y = ele.y ? ele.y : 0
    const width = ele.width ? ele.width : 250
    const height = ele.height ? ele.height : 250

    // this.ctx.font = `normal normal bold 30px arial,sans-serif`;
    if (ele.font) {
      this.ctx.font = ele.font.replace(/(\d)+/g, (macth: any) => {
        return macth * this.ratio
      })
    }
    if (ele.textAlign) {
      this.ctx.textAlign = ele.textAlign
    }
    if (ele.fillStyle) {
      this.ctx.fillStyle = ele.fillStyle
    }

    this.ctx.fillText(ele.content, x, y)
  }
}

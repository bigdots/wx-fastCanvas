import drawQrcode from './drawCode'
import FastCanvas from '../../index'

export default class Qrcode extends FastCanvas {
  draw(ele: any) {
    // 默认值
    const x = ele.x ? ele.x : 0
    const y = ele.y ? ele.y : 0
    const width = ele.width ? ele.width : 250
    const height = ele.height ? ele.height : 250
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

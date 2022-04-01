class FastCanvas {
  constructor() {
    
  }
  async init(obj){
    console.log(obj);
    //dpr设备像素比，物理像素与css像素的比值
    const { pixelRatio:dpr, screenWidth } = wx.getSystemInfoSync();
    // 屏幕与设计稿的比值
    const ScreenUiratio = screenWidth / obj.UIwidth;
    this.ratio = ScreenUiratio * dpr;
    const nodes = await this.getCanvasNode(obj.id)
    this.canvas = nodes[0].node;
    this.canvas.width = obj.width*this.ratio;
    this.canvas.height = obj.height*this.ratio;
    this.ctx = this.canvas.getContext("2d");
    return this;
  }

  async downLoad() {
    this.saveCanvasToPhotosAlbum(this.canvas);
    return this;
  }

  async getTempFilePath(){
     // 下载到本地临时文件
     const res = await wx.canvasToTempFilePath({
      canvas:this.canvas,
    },this);
    this.canvas.tempFilePath = res.tempFilePath
    return this
  }

  async saveCanvasToPhotosAlbum(canvas) {
    try {
      // 处理授权
      const setting = await wx.getSetting();
      if (!setting.authSetting["scope.writePhotosAlbum"]) {
        // 授权写入相册权限
        await wx.authorize({ scope: "scope.writePhotosAlbum" });
      }
      wx.showLoading({
        title: "下载中",
      });
      // 下载到本地临时文件
      const downRes = await wx.canvasToTempFilePath({
        canvas,
      },this);
  
      // 写入相册
      await wx.saveImageToPhotosAlbum({
        filePath: downRes.tempFilePath,
      });
  
      wx.hideLoading();
    } catch (e) {
      console.error(e);
      wx.showToast({
        icon: "none",
        title: "保存图片失败",
      });
    }
  }

  imageLoad(url) {
    return new Promise((resolve, reject) => {
      const img = this.canvas.createImage();
      img.src = url;
      img.onload = () => {
        resolve(img);
      };
      img.onerror = () => {
        reject("图片加载失败");
      };
    });
  }

  getCanvasNode(selector) {
    return new Promise((resolve, reject) => {
      const query = wx.createSelectorQuery();
      query.select(selector).fields({ node: true, size: true });
      query.exec((res) => {
        resolve(res);
      });
    });
  }

  async draw(arr) {
    //   const {} = this;
    // console.log(this)
    for (let i = 0; i < arr.length; i++) {
      const ele = arr[i];
      if (ele.type == "img") {
        // console.log(ele.src)
        const img = await this.imageLoad(ele.src);
        this.ctx.drawImage(
          img,
          ele.x * this.ratio,
          ele.y * this.ratio,
          ele.width * this.ratio,
          ele.height * this.ratio
        );
      }
      
      if (ele.type == "text") {
        // this.ctx.font = `normal normal bold 30px arial,sans-serif`;
        if(ele.font){
            this.ctx.font = ele.font.replace(/(\d)+/g, (macth) => {
                return macth * this.ratio;
            });
        }
        if(ele.textAlign){
            this.ctx.textAlign = ele.textAlign;
        }
        if(ele.fillStyle){
            this.ctx.fillStyle = ele.fillStyle
        }
        
        this.ctx.fillText(
          ele.content,
          ele.x * this.ratio,
          ele.y * this.ratio
        );
      }
    }

    return this
  }
}

export default FastCanvas;

// miniprogram/components/​puzzleVerify​/index.js
Component({
  /*
    组件的属性列表(接收父组件的值)
  */
  properties: {
    isShow: {
      type: Boolean,
    }
  },
  /*
    监听传入的变量,当传入的值发生变化时,触发方法
  */
  observers: {
    "isShow": function (val) {
      //val --> 就是父组件传入组件中的tabsList数据
      // console.log('===isShow===', val)
    },
    // "xD": function (val) {
    //   console.log('===xD===', val)
    //   this.setData({
    //     xD: val
    //   })
    // }
  },

  /*
    组件的初始数据
  */
  data: {
    puzzleVerifyBgImgUrl: '../../images/img_codeBg1.jpg', //背景图片
    slideTips: '向右滑动完成验证',
    slideBgCur: 'status-1',
    verificationCode: '',
    rules: {},

    canvasOne: [],

    //滑块x轴数据
    slider: {
      mx: 0,
      bx: 0,
    },

    //拼图是否正确
    puzzle: false,

    checkx: '',
    xD: 0,
    yD: 0,
    downCoordinate: {
      x: '',
      y: ''
    }
  },
  /*
    组件的方法列表
  */
  methods: {
    //拼图验证码初始化
    canvasInit(e) {
      this.setData({
        slideTips: "向右滑动完成验证",
        slideBgCur: 'status-1',
        xD: 0
      })
      console.log('===this.data.isShow===', this.data.isShow)
      if (this.data.isShow) {
        //生成指定区间的随机数
        const random = (min, max) => {
          return Math.floor(Math.random() * (max - min + 1) + min)
        }
        //x: 254, y: 109
        // let mx = random(127, 234),
        //   bx = random(10, 97),
        //   y = random(10, 99)

        let mx = random(127, 244)
        let bx = 5
        let y = 50

        this.data.slider = {
          mx,
          bx
        }
        console.log(this.data.slider)
        this.draw(mx, bx, y)
      }
    },

    //绘制canvas图像
    draw(mx = 200, bx = 20, y = 50) {
      let width = 0
      let height = 0
      let mainxy = {
        x: mx,
        y: y,
        r: 6
      };
      let blockxy = {
        x: bx,
        y: y,
        r: 6
      };
      const mainDom = this.createSelectorQuery()
      mainDom.select('#codeImg')
        .fields({
          node: true,
          size: true
        })
        .exec(async (res) => {
          this.canvasOne = res
          let canvas1 = res[0].node
          let bg = canvas1.getContext('2d')
          //let dpr = wx.getWindowInfo().pixelRatio //获取设备的dpi像素 2
          bg.fillStyle = 'ff0000'
          bg.fillRect(0, 0, width, height);

          // width = canvas1.width
          width = canvas1.width
          height = canvas1.height

          console.log('====width height===', width, height)

          canvas1.height = height

          const img = canvas1.createImage()
          img.src = this.data.puzzleVerifyBgImgUrl
          img.style.objectFit = "scale-down"
          img.onload = function () {
            bg.drawImage(img, 0, 0, width, height)
          }

          this.drawBlock(bg, mainxy, "fill"); //实体快(有背景的)
        })

      const blockDom = this.createSelectorQuery()
      blockDom.select('#sliderBlock')
        .fields({
          node: true,
          size: true
        })
        .exec(async (res) => {
          let canvas2 = res[0].node
          let block = canvas2.getContext("2d")
          //block.fillStyle = 'ff0000'
          //block.fillRect(0, 0, width, height);

          console.log('====canvas2====', height)
          canvas2.height = height

          const img = this.canvasOne[0].node.createImage()
          img.src = this.data.codeImgBgUrl
          img.style.objectFit = "scale-down"
          img.onload = function () {
            block.drawImage(img, 0, 0, width, height)
          }
          this.drawBlock(block, blockxy, "clip"); //挖滑块块
        })
    },

    //绘制拼块部分
    drawBlock(ctx, xy = {
      x: 254,
      y: 50,
      r: 6
    }, type) {
      let x = xy.x,
        y = xy.y,
        r = xy.r,
        w = 40;
      let PI = Math.PI
      //绘制
      ctx.beginPath()
      //left
      ctx.moveTo(x, y)
      //top
      ctx.arc(x + (w + 5) / 2, y, r, -PI, 0, true)
      ctx.lineTo(x + w + 5, y)
      //right
      ctx.arc(x + w + 5, y + w / 2, r, 1.5 * PI, 0.5 * PI, false)
      ctx.lineTo(x + w + 5, y + w)
      //bottom
      ctx.arc(x + (w + 5) / 2, y + w, r, 0, PI, false)
      ctx.lineTo(x, y + w)
      ctx.arc(x, y + w / 2, r, 0.5 * PI, 1.5 * PI, true)
      ctx.lineTo(x, y)
      //修饰，没有会看不出效果
      ctx.lineWidth = 2
      ctx.fillStyle = "rgba(0, 0, 0, 1)";
      ctx.strokeStyle = "rgba(0, 0, 0, 1)";
      ctx.stroke()
      ctx[type]()
      ctx.globalCompositeOperation = 'xor' //遮罩部分
    },

    // 滑动开始
    slide_start(e) {
      this.setData({
        checkx: Number(this.data.slider.mx) - Number(this.data.slider.bx),
        downCoordinate: {
          x: e.changedTouches[0].pageX,
          y: e.changedTouches[0].pageY
        },
        xD: 0
      })
      console.log('===xD start===', this.data.xD)
    },

    // 滑动中
    slide_move(e) {
      this.setData({
        xD: e.changedTouches[0].pageX - this.data.downCoordinate.x
      })
      //this.data.xY = e.changedTouches[0].pageY - downCoordinate.y
      console.log('===xD move===', this.data.xD)
      if (this.data.xD >= (256 - 80) || this.data.xD <= 0) {
        console.log('超出了')
        return
      }
    },

    //滑动结束
    slide_end(e) {
      this.setData({
        xD: 0
      })
      // 实际滑动会偏小，进行偏移
      let max = this.data.checkx - 5
      let min = this.data.checkx - 10

      // 采用点击距离和最终离开距离计算滑动距离
      let movex = e.changedTouches[0].pageX - this.data.downCoordinate.x

      //允许正负误差1
      if ((max >= movex && movex >= min) || movex === this.data.checkx) {
        console.log("拼图成功")
        this.setData({
          slideBgCur: 'status-2',
          puzzle: true,
          slideTips: "验证成功"
        })
        setTimeout(() => {
          this.setData({
            isShow: false
          })
          this.canvasInit()
        }, 600)
      } else {
        console.log("拼图失败")
        this.setData({
          slideBgCur: 'status-3',
          puzzle: false,
          slideTips: "验证失败，请重试",
        })

        setTimeout(() => {
          this.canvasInit()
        }, 600)
      }

      this.triggerEvent('customEvent', {
        puzzle: this.data.puzzle,
        isShow: this.data.isShow
      })
    },

    //关闭验证弹框
    closeDialog() {
      this.triggerEvent('customClose')
    }
  },
  /*
    组件生命周期
  */
  lifetimes: {
    created() {
      // 在组件实例刚刚被创建时执行
    },
    onLoad(options) {
      // this.canvasInit()
    },
    ready() {
      /* 
        在组件在视图层布局完成后执行
      */
    },
  }
})
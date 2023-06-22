import { EASE_IN_OUT_QUAD, Fx } from '../../../utils/fx'
import { ARC_EDGE_STYLE, DEVICE_HEIGHT, DEVICE_WIDTH, RECT_BACKGROUND_STYLE, RECT_BLOCK_STYLE } from './index.style'
import { gettext } from 'i18n'
import { data } from '../../../utils/data'
const logger = DeviceRuntimeCore.HmLogger.getLogger('helloworld')
Page({
  build() {

    logger.debug('page build invoked')
    // Edge ARC
    // hmUI.createWidget(hmUI.widget.ARC, {
    //   ...ARC_EDGE_STYLE
    // })
    // Theme

    var SNAKE_COLOR, EMPTY_COLOR, BACKGROUND_COLOR, FOOD_COLOR


    //TODO 一些设置
    let now_theme = data.json.theme
    let lastScore = 0
    // Get Color
    switch (now_theme) { // TODO 补充颜色
      case 0: // orange
        SNAKE_COLOR = 0xff9933;
        EMPTY_COLOR = 0xeec600;
        BACKGROUND_COLOR = 0xfffb8a;
        FOOD_COLOR = 0xd35004;
        break;
      case 1: // ice
        SNAKE_COLOR = 0x32a0dc;
        EMPTY_COLOR = 0xc5e7f9;
        BACKGROUND_COLOR = 0x8ecff1;
        FOOD_COLOR = 0x752aff;
        break;
      // case 2: // hacker
      //   SNAKE_COLOR = 0x006d02;
      //   EMPTY_COLOR = 0x1caa1f;
      //   BACKGROUND_COLOR = 0x003e01;
      //   FOOD_COLOR = 0x00ff08;
      //   break;

      case 2: // blackWhite
        SNAKE_COLOR = 0xaaaaaa;
        EMPTY_COLOR = 0x777777;
        BACKGROUND_COLOR = 0x555555;
        FOOD_COLOR = 0xffffff;
        break;
      default:
        break;
    }

    // Game Data
    const BlockType = {
      EMPTY: 0,
      SNAKE: 1,
      FOOD: 2,
    }
    const Facing = {
      NULL: 0,
      LEFT: 1,
      RIGHT: 2,
      UP: 3,
      DOWN: 4,

    }
    const BLOCK_EDGE_NUMBER = data.json.edgeNumber;
    var blockData = []
    var snakeLength = 3; // TODO

    for (let i = 0; i < BLOCK_EDGE_NUMBER; ++i) {
      blockData[i] = []
      for (let j = 0; j < BLOCK_EDGE_NUMBER; ++j) {
        blockData[i][j] = {
          blockType: BlockType.EMPTY,
          facing: Facing.RIGHT,
        }
      }
    }

    // 方块位置的计算
    const BACKGROUND_LENGTH = px(338) //背景矩形的边长
    const BLOCK_DISTANCE = px(7) //块与块之间的距离
    // 块的宽度
    const BLOCK_LENGTH = (BACKGROUND_LENGTH - BLOCK_DISTANCE * (BLOCK_EDGE_NUMBER + 1)) / BLOCK_EDGE_NUMBER
    // 时间文字
    const jstime = hmSensor.createSensor(hmSensor.id.TIME)
    var lastTime = { hour: jstime.hour, minute: jstime.minute }
    let timeText = hmUI.createWidget(hmUI.widget.TEXT, {
      x: px(140),
      y: px(10),
      w: px(200),
      h: px(50),
      text: jstime.hour + ":" + (jstime.minute<10?"0":"") + jstime.minute,
      color: 0xcccccc,
      text_size: px(36),
      align_h: hmUI.align.CENTER_H,
      align_V: hmUI.align.CENTER_V,
    })
    // 长度文字
    let lengthText = hmUI.createWidget(hmUI.widget.TEXT, {
      x: px(140),
      y: px(420),
      w: px(200),
      h: px(50),
      text: gettext('lengthText') + ': ' + snakeLength,
      color: 0xcccccc,
      text_size: px(32),
      align_h: hmUI.align.CENTER_H,
      align_V: hmUI.align.CENTER_V,
    })
    // 加载文字
    let loadText = hmUI.createWidget(hmUI.widget.TEXT, {
      x: (DEVICE_WIDTH - px(200)) / 2,
      y: (DEVICE_HEIGHT - px(100)) / 2,
      w: px(200),
      h: px(100),
      align_h: hmUI.align.CENTER_H,
      align_v: hmUI.align.CENTER_V,
      color: 0xfffffff,
      text: gettext('loadText'),
      text_size: px(50),
    })
    // Block矩形
    var blocks = []
    let tempOffsetLengthX = (px(480) - BACKGROUND_LENGTH) / 2 + BLOCK_DISTANCE
    let tempOffsetLengthY = (px(480) - BACKGROUND_LENGTH) / 2 + BLOCK_DISTANCE

    let timerInit = timer.createTimer(
      20,
      100000,
      option => {
        // 背景矩形
        var rectBackground = hmUI.createWidget(hmUI.widget.FILL_RECT, {
          ...RECT_BACKGROUND_STYLE,
          w: BACKGROUND_LENGTH,
          h: BACKGROUND_LENGTH,
          color: BACKGROUND_COLOR,
        })
        // 添加每个小块的控件
        {// 遍历行
          for (let i = 0; i < BLOCK_EDGE_NUMBER; ++i) {
            blocks[i] = []
            // 遍历一行中的每个元素
            for (let j = 0; j < BLOCK_EDGE_NUMBER; ++j) {
              blocks[i].push(
                hmUI.createWidget(hmUI.widget.FILL_RECT, {
                  ...RECT_BLOCK_STYLE,
                  x: tempOffsetLengthX,
                  y: tempOffsetLengthY,
                  w: BLOCK_LENGTH,
                  h: BLOCK_LENGTH,
                  color: EMPTY_COLOR, // TODO color
                })
              )
              tempOffsetLengthX += BLOCK_DISTANCE + BLOCK_LENGTH
            }
            tempOffsetLengthX = (px(480) - BACKGROUND_LENGTH) / 2 + BLOCK_DISTANCE
            tempOffsetLengthY += BLOCK_DISTANCE + BLOCK_LENGTH
          }
        }
        // 初始化蛇
        blockData[1][1].blockType = BlockType.SNAKE
        blockData[1][2].blockType = BlockType.SNAKE
        blockData[1][3].blockType = BlockType.SNAKE
        // blockData[1][4].blockType = BlockType.SNAKE
        // blockData[1][5].blockType = BlockType.SNAKE
        // blockData[1][6].blockType = BlockType.SNAKE
        // blockData[1][7].blockType = BlockType.SNAKE
        blockData[1][1].facing = Facing.RIGHT
        blockData[1][2].facing = Facing.RIGHT
        blockData[1][3].facing = Facing.NULL
        // blockData[1][4].facing = Facing.RIGHT
        // blockData[1][5].facing = Facing.RIGHT
        // blockData[1][6].facing = Facing.RIGHT
        // blockData[1][7].facing = Facing.DOWN
        blocks[1][1].setProperty(hmUI.prop.COLOR, SNAKE_COLOR)
        blocks[1][2].setProperty(hmUI.prop.COLOR, SNAKE_COLOR)
        blocks[1][3].setProperty(hmUI.prop.COLOR, SNAKE_COLOR)
        newFood()
        var touchTestWidget = hmUI.createWidget(hmUI.widget.TEXT, {
          x: 0,
          y: 0,
          w: px(480),
          h: px(480),
          text: ""
        })
        touchTestWidget.addEventListener(hmUI.event.CLICK_DOWN, function (info) {
          downCoord.x = info.x
          downCoord.y = info.y
        })
        touchTestWidget.addEventListener(hmUI.event.CLICK_UP, function (info) {
          upCoord.x = info.x
          upCoord.y = info.y
          let distanceX = upCoord.x - downCoord.x
          let distanceY = upCoord.y - downCoord.y
          if (Math.abs(distanceX) + Math.abs(distanceY) >= 30) {
            if (Math.abs(distanceX) <= Math.abs(distanceY)) { // 上或者下
              if (distanceY <= 0) move_event = MoveEvent.UP //上
              else move_event = MoveEvent.DOWN
            }
            else { // 左或者右
              if (distanceX <= 0) move_event = MoveEvent.LEFT //左
              else move_event = MoveEvent.RIGHT
            }
          }
        })
        // blocks[1][4].setProperty(hmUI.prop.COLOR, SNAKE_COLOR)
        // blocks[1][5].setProperty(hmUI.prop.COLOR, SNAKE_COLOR)
        // blocks[1][6].setProperty(hmUI.prop.COLOR, SNAKE_COLOR)
        // blocks[1][7].setProperty(hmUI.prop.COLOR, SNAKE_COLOR)//TODO
        let LOOP_DELAY_TIME = 0 // 循環延遲時間
        switch (data.json.speed) {
          case 0: // low
            LOOP_DELAY_TIME = 600
            break
          case 1: // normal
            LOOP_DELAY_TIME = 500
            break
          case 2: // fast
            LOOP_DELAY_TIME = 400
            break
          case 3: // master
            LOOP_DELAY_TIME = 300
            break
        }
        // Register Loop Event
        //创建timer，延时500ms触发，之后每1000ms执行一次
        const mainTimer = timer.createTimer(
          1,
          LOOP_DELAY_TIME,
          (option) => {
            console.log('timer callback')

            // 判斷方向
            switch (move_event) {
              case MoveEvent.UP: facing = Facing.UP; break
              case MoveEvent.DOWN: facing = Facing.DOWN; break
              case MoveEvent.LEFT: facing = Facing.LEFT; break
              case MoveEvent.RIGHT: facing = Facing.RIGHT; break
            }
            // Detect Facing Block
            switch (facing) {
              case Facing.DOWN: {
                // Border?
                if (headLocation.y == BLOCK_EDGE_NUMBER - 1) { isOver = true }// TODO
                // Snake?
                else if (blockData[headLocation.y + 1][headLocation.x].blockType == BlockType.SNAKE && blockData[headLocation.y + 1][headLocation.x].facing != Facing.UP) { isOver = true }
                // Food?
                else if (blockData[headLocation.y + 1][headLocation.x].blockType ==
                  BlockType.FOOD) {
                  snakeLength += 1
                  blockData[headLocation.y][headLocation.x].facing = Facing.DOWN
                  blockData[headLocation.y + 1][headLocation.x].blockType = BlockType.SNAKE
                  headLocation.y++
                  blockData[headLocation.y][headLocation.x].facing = Facing.NULL
                  //blocks[headLocation.y][headLocation.x].setProperty(hmUI.prop.COLOR, SNAKE_COLOR)
                  changeColor(headLocation.x, headLocation.y, FOOD_COLOR, SNAKE_COLOR) // TODO
                  //changeSize(headLocation.x, headLocation.y)
                  changeSizeFromHeadToTail()
                  newFood()

                }
                // Empty?
                else if (blockData[headLocation.y + 1][headLocation.x].blockType == BlockType.EMPTY) {
                  // Head
                  blockData[headLocation.y][headLocation.x].facing = Facing.DOWN
                  blockData[headLocation.y + 1][headLocation.x].blockType = BlockType.SNAKE
                  headLocation.y++
                  blockData[headLocation.y][headLocation.x].facing = Facing.NULL
                  changeColor(headLocation.x, headLocation.y, EMPTY_COLOR, SNAKE_COLOR) // TODO
                  //blocks[headLocation.y][headLocation.x].setProperty(hmUI.prop.COLOR, SNAKE_COLOR)
                  // Tail
                  blockData[tailLocation.y][tailLocation.x].blockType = BlockType.EMPTY
                  //blocks[tailLocation.y][tailLocation.x].setProperty(hmUI.prop.COLOR, EMPTY_COLOR)
                  changeColor(tailLocation.x, tailLocation.y, SNAKE_COLOR, EMPTY_COLOR) // TODO

                  switch (blockData[tailLocation.y][tailLocation.x].facing) {
                    case Facing.UP:
                      tailLocation.y--
                      break
                    case Facing.DOWN:
                      tailLocation.y++
                      break
                    case Facing.LEFT:
                      tailLocation.x--
                      break
                    case Facing.RIGHT:
                      tailLocation.x++
                      break
                  }
                }
              } break
              case Facing.UP: {
                // Border?
                if (headLocation.y == 0) { isOver = true }
                // Snake?
                else if (blockData[headLocation.y - 1][headLocation.x].blockType == BlockType.SNAKE && blockData[headLocation.y - 1][headLocation.x].facing != Facing.DOWN ) { isOver = true }
                // Food?
                else if (blockData[headLocation.y - 1][headLocation.x].blockType == BlockType.FOOD) {
                  snakeLength += 1
                  blockData[headLocation.y][headLocation.x].facing = Facing.UP
                  blockData[headLocation.y - 1][headLocation.x].blockType = BlockType.SNAKE
                  headLocation.y--
                  blockData[headLocation.y][headLocation.x].facing = Facing.NULL
                  // blocks[headLocation.y][headLocation.x].setProperty(hmUI.prop.COLOR, SNAKE_COLOR)
                  changeColor(headLocation.x, headLocation.y, FOOD_COLOR, SNAKE_COLOR) // TODO
                  changeSizeFromHeadToTail()


                  newFood()
                }
                // Empty?
                else if (blockData[headLocation.y - 1][headLocation.x].blockType == BlockType.EMPTY){
                  // Head
                  blockData[headLocation.y][headLocation.x].facing = Facing.UP
                  blockData[headLocation.y - 1][headLocation.x].blockType = BlockType.SNAKE
                  headLocation.y--
                  blockData[headLocation.y][headLocation.x].facing = Facing.NULL

                  changeColor(headLocation.x, headLocation.y, EMPTY_COLOR, SNAKE_COLOR) // TODO

                  // Tail
                  blockData[tailLocation.y][tailLocation.x].blockType = BlockType.EMPTY
                  changeColor(tailLocation.x, tailLocation.y, SNAKE_COLOR, EMPTY_COLOR) // TODO

                  switch (blockData[tailLocation.y][tailLocation.x].facing) {
                    case Facing.UP:
                      tailLocation.y--
                      break
                    case Facing.DOWN:
                      tailLocation.y++
                      break
                    case Facing.LEFT:
                      tailLocation.x--
                      break
                    case Facing.RIGHT:
                      tailLocation.x++
                      break
                  }
                }
              } break
              case Facing.LEFT: {
                // Border?
                if (headLocation.x == 0) { isOver = true }
                // Snake?
                else if (blockData[headLocation.y][headLocation.x - 1].blockType == BlockType.SNAKE && blockData[headLocation.y][headLocation.x - 1].facing != Facing.RIGHT ) { isOver = true }
                // Food?
                else if (blockData[headLocation.y][headLocation.x - 1].blockType == BlockType.FOOD) {
                  snakeLength += 1
                  blockData[headLocation.y][headLocation.x].facing = Facing.LEFT
                  blockData[headLocation.y][headLocation.x - 1].blockType = BlockType.SNAKE
                  headLocation.x--
                  blockData[headLocation.y][headLocation.x].facing = Facing.NULL

                  changeColor(headLocation.x, headLocation.y, FOOD_COLOR, SNAKE_COLOR) // TODO
                  changeSizeFromHeadToTail()


                  newFood()
                }
                // Empty?
                else if (blockData[headLocation.y][headLocation.x - 1].blockType == BlockType.EMPTY){
                  // Head
                  blockData[headLocation.y][headLocation.x].facing = Facing.LEFT
                  blockData[headLocation.y][headLocation.x - 1].blockType = BlockType.SNAKE
                  headLocation.x--
                  blockData[headLocation.y][headLocation.x].facing = Facing.NULL
                  changeColor(headLocation.x, headLocation.y, EMPTY_COLOR, SNAKE_COLOR) // TODO

                  // Tail
                  blockData[tailLocation.y][tailLocation.x].blockType = BlockType.EMPTY
                  changeColor(tailLocation.x, tailLocation.y, SNAKE_COLOR, EMPTY_COLOR) // TODO

                  switch (blockData[tailLocation.y][tailLocation.x].facing) {
                    case Facing.UP:
                      tailLocation.y--
                      break
                    case Facing.DOWN:
                      tailLocation.y++
                      break
                    case Facing.LEFT:
                      tailLocation.x--
                      break
                    case Facing.RIGHT:
                      tailLocation.x++
                      break
                  }
                }
              } break
              case Facing.RIGHT: {
                // Border?

                if (headLocation.x == BLOCK_EDGE_NUMBER - 1) { logger.debug('border'); isOver = true }
                // Snake?
                else if (blockData[headLocation.y][headLocation.x + 1].blockType == BlockType.SNAKE && blockData[headLocation.y][headLocation.x + 1].facing != Facing.LEFT ) { logger.debug('snake'); isOver = true }
                // Food?
                else if (blockData[headLocation.y][headLocation.x + 1].blockType == BlockType.FOOD) {
                  snakeLength += 1
                  logger.debug('food')
                  blockData[headLocation.y][headLocation.x].facing = Facing.RIGHT
                  blockData[headLocation.y][headLocation.x + 1].blockType = BlockType.SNAKE
                  headLocation.x++
                  blockData[headLocation.y][headLocation.x].facing = Facing.NULL

                  changeColor(headLocation.x, headLocation.y, FOOD_COLOR, SNAKE_COLOR) // TODO
                  changeSizeFromHeadToTail()


                  newFood()
                }
                // Empty?
                else if (blockData[headLocation.y][headLocation.x + 1].blockType == BlockType.EMPTY){
                  // Head
                  logger.debug('empty')
                  blockData[headLocation.y][headLocation.x].facing = Facing.RIGHT
                  blockData[headLocation.y][headLocation.x + 1].blockType = BlockType.SNAKE
                  headLocation.x++
                  blockData[headLocation.y][headLocation.x].facing = Facing.NULL
                  changeColor(headLocation.x, headLocation.y, EMPTY_COLOR, SNAKE_COLOR) // TODO


                  // Tail
                  blockData[tailLocation.y][tailLocation.x].blockType = BlockType.EMPTY
                  changeColor(tailLocation.x, tailLocation.y, SNAKE_COLOR, EMPTY_COLOR) // TODO

                  switch (blockData[tailLocation.y][tailLocation.x].facing) {
                    case Facing.UP:
                      tailLocation.y--
                      break
                    case Facing.DOWN:
                      tailLocation.y++
                      break
                    case Facing.LEFT:
                      tailLocation.x--
                      break
                    case Facing.RIGHT:
                      tailLocation.x++
                      break
                  }
                }
              } break
            } // switch(facing)
            // 时间刷新
            if (jstime.hour != lastTime.hour || jstime.minute != lastTime.minute) {
              lastTime.hour = jstime.hour
              lastTime.minute = jstime.minute
              timeText.setProperty(hmUI.prop.TEXT, lastTime.hour + ':' + (jstime.minute<10?"0":"") + jstime.minute)
            }
            // 分数刷新
            if (snakeLength != lastScore) {
              lastScore = snakeLength
              lengthText.setProperty(hmUI.prop.TEXT, gettext('lengthText') + ': ' + lastScore)
            }
            // Detect Over
            if (isOver) {
              logger.debug('over')
              // 取消注册手势监听
              hmApp.unregisterGestureEvent()
              timeText.setProperty(hmUI.prop.TEXT, gettext('overTip'))
              let best = data.json.record['' + BLOCK_EDGE_NUMBER * 100 + data.json.speed]
              if (best == undefined || best < snakeLength) {
                best = snakeLength
                data.json.record['' + BLOCK_EDGE_NUMBER * 100 + data.json.speed] = snakeLength
                data.save()
                hmUI.showToast({
                  text: gettext("failToast1") + "\n" + gettext("failToast2") + snakeLength + "\n" + gettext("failToast5")
                })
              } else {

                hmUI.showToast({
                  text: gettext("failToast3") + snakeLength + '\n' + gettext("failToast4") + best + "\n" + gettext("failToast5")
                })
              }
              changeSizeFromHeadToTail(true)
              timer.stopTimer(mainTimer)

            }



          },
          {}
        )
        timer.stopTimer(timerInit)
      },
      {}
    )

    // //用于平滑移动的函数
    // let fx_changeColor = new Fx({ 
    //   x_start: 0,
    //   x_end: 100,
    //   total_time: 200,
    //   fx: x => EASE_IN_OUT_QUAD(x, 0, 100, 100),
    //   func(y) { 

    //   },
    //   enable: false, 
    //   per_clock: 10,
    // }) 
    // 获取渐变新对象
    function getNewChangeColorObject() {
      return new Fx({
        x_start: 0,
        x_end: 100,
        total_time: 200,
        fx: x => EASE_IN_OUT_QUAD(x, 0, 100, 100),
        func(y) {

        },
        enable: false,
        per_clock: 30,
      })
    }
    // 获取渐变新对象
    function getNewChangeSizeObject() {
      return new Fx({
        x_start: 30,
        x_end: 100,
        total_time: 200,
        fx: x => EASE_IN_OUT_QUAD(x, 0, 12, 100), //TODO:8
        func(y) {

        },
        enable: false,
        per_clock: 30,
      })
    }
    // 动画函数
    function changeColor(blockX, blockY, color0, color1) {
      if (data.json.anim.color) {
        let newFx = getNewChangeColorObject()
        newFx.func = function (y) {
          let r0 = color0 & 0xFF0000, g0 = color0 & 0x00FF00, b0 = color0 & 0x0000FF
          let r1 = color1 & 0xFF0000, g1 = color1 & 0x00FF00, b1 = color1 & 0x0000FF
          let result = (Math.floor((r1 - r0) / 100.0 * y + r0) & 0xFF0000)
            + (Math.floor((g1 - g0) / 100.0 * y + g0) & 0x00FF00)
            + (Math.floor((b1 - b0) / 100.0 * y + b0) & 0x0000FF)
          // console.log("R:" + (Math.floor((r1 - r0) / 100.0 * y + r0) & 0xFF0000))
          // console.log("G:" + (Math.floor((g1 - g0) / 100.0 * y + g0) & 0x00FF00))
          // console.log("B:" + (Math.floor((b1 - b0) / 100.0 * y + b0) & 0x0000FF))
          // console.log("RGB:" + result)
          // console.log("(b1 - b0)" + (b1 - b0))
          // console.log("(b1 - b0) / 100.0" + (b1 - b0) / 100.0)
          // console.log("Math.floor((b1 - b0) / 100.0 * y" + Math.floor((b1 - b0) / 100.0 * y))
          // console.log("(Math.floor((b1 - b0) / 100.0 * y + b0))" + (Math.floor((b1 - b0) / 100.0 * y + b0)))
          blocks[blockY][blockX].setProperty(hmUI.prop.COLOR, result)
        }
        newFx.restart()
      }
      else {
        blocks[blockY][blockX].setProperty(hmUI.prop.COLOR, color1)
      }
    }
    // 动画函数
    function changeSize(blockX, blockY) {
      if(data.json.anim.size) {
        let newFx = getNewChangeSizeObject()
        newFx.func = function (d) {
          d = 12 - d
          let x = (px(480) - BACKGROUND_LENGTH) / 2 + BLOCK_DISTANCE
          let y = (px(480) - BACKGROUND_LENGTH) / 2 + BLOCK_DISTANCE
          for (let i = 0; i < blockX; ++i) {
            x += BLOCK_DISTANCE + BLOCK_LENGTH
          }
          for (let i = 0; i < blockY; ++i) {
            y += BLOCK_DISTANCE + BLOCK_LENGTH
          }
          x -= d / 2
          y -= d / 2
          blocks[blockY][blockX].setProperty(hmUI.prop.MORE, {
            x, y,
            w: BLOCK_LENGTH + d,
            h: BLOCK_LENGTH + d,
          })
        }
        newFx.restart()
      }
    }
    // 遍历changeSize
    function changeSizeFromHeadToTail(bChangeColor) {
      if (bChangeColor == undefined) { bChangeColor = false }
      let coorLists = new Array()
      let tempX = tailLocation.x
      let tempY = tailLocation.y
      let finish = false
      while (true) {
        // logger.debug("coorlist length:" + coorLists.length)
        // logger.debug("facing:" + blockData[tempY][tempX].facing)
        coorLists.push([tempX, tempY])
        if (tempY == headLocation.y && tempX == headLocation.x) {
          break
        }

        switch (blockData[tempY][tempX].facing) {
          case Facing.UP:
            --tempY
            break
          case Facing.DOWN:
            ++tempY
            break
          case Facing.LEFT:
            --tempX
            break
          case Facing.RIGHT:
            ++tempX
            break
          case Facing.NULL:
            finish = true
        }
        if (finish) break
        if (tempX == -1 || tempY == -1 || tempX == BLOCK_EDGE_NUMBER || tempY == BLOCK_EDGE_NUMBER) {
          break
        }
        else if (blockData[tempY][tempX].blockType != BlockType.SNAKE) {
          break
        }
        
      }


      let _timer = timer.createTimer(
        1,
        50,
        function (option) {
          let target = coorLists.pop()
          if (bChangeColor) { blocks[target[1]][target[0]].setProperty(hmUI.prop.COLOR, 0xff2222) }
          changeSize(target[0], target[1])
          if (coorLists.length == 0) { timer.stopTimer(_timer) }
        },
        {}
      )
    }

    // // 开局动画 左上到右下
    // { 
    //   let coorList = []
    //   // 获取时刻坐标
    //   for (let total = 0; total < BLOCK_EDGE_NUMBER * 2 - 1; ++total) {
    //     coorList[total] = []
    //     for (let row = 0; row < BLOCK_EDGE_NUMBER; ++row) {
    //       let line = total - row
    //       if (line >= 0 && line <= BLOCK_EDGE_NUMBER - 1) {
    //         coorList[total].push([row, line])
    //       }
    //     }
    //   }
    //   let tempIndex = 0
    //   let _timer = timer.createTimer(
    //     10, 
    //     20,
    //     function (option) {
    //       coorList[tempIndex].forEach(coord => {
    //         changeSize(coord[0], coord[1])
    //         blocks[coord[1]][coord[0]].setProperty(hmUI.prop.COLOR, EMPTY_COLOR)
    //       })
    //       ++tempIndex
    //       if(tempIndex == BLOCK_EDGE_NUMBER * 2) {
    //         timer.stopTimer(_timer)
    //       }
    //     }, 
    //     {}
    //   )
    // }


    // 初始化食物 
    var getNewFoodLocation = function () {
      let rm = Math.random()
      rm = Math.floor(rm * 1000000)
      let x, y
      x = rm % BLOCK_EDGE_NUMBER
      y = ((rm - x) / BLOCK_EDGE_NUMBER) % BLOCK_EDGE_NUMBER
      return { x, y }
    }
    var foodLocation = { x: 0, y: 0 }
    // do{
    //   let tempLocation = getNewFoodLocation()
    //   if(tempLocation.x >= 1 && tempLocation.x <= 3 && tempLocation.y == 1) {

    //   }
    //   else {
    //     foodLocation.x = tempLocation.x
    //     foodLocation.y = tempLocation.y
    //     blocks[foodLocation.y][foodLocation.x].setProperty(hmUI.prop.COLOR, FOOD_COLOR)
    //     blockData[foodLocation.y][foodLocation.x].blockType = BlockType.FOOD
    //     break // TODO
    //   }
    // }while(true) 
    var newFood = function () {
      
      if(snakeLength == BLOCK_EDGE_NUMBER * BLOCK_EDGE_NUMBER) return
      do {
        let tempLocation = getNewFoodLocation()
        if (blockData[tempLocation.y][tempLocation.x].blockType == BlockType.EMPTY) {
          foodLocation.x = tempLocation.x
          foodLocation.y = tempLocation.y
          blocks[foodLocation.y][foodLocation.x].setProperty(hmUI.prop.COLOR, FOOD_COLOR)
          blockData[foodLocation.y][foodLocation.x].blockType = BlockType.FOOD
          break // TODO
        }
      } while (true)
    }
    // 触控事件
    const MoveEvent = {
      NULL: 0, // 没有触发事件
      LEFT: 1,
      RIGHT: 2,
      UP: 3,
      DOWN: 4,
    }
    var move_event = MoveEvent.NULL

    // 游戲重要數據
    let facing = Facing.RIGHT
    let headLocation = {
      x: 3,
      y: 1,
    }
    let tailLocation = {
      x: 1,
      y: 1,
    }
    let isOver = false // 是否失敗

    // 手势监听控件
    let downCoord = { x: 0, y: 0 }
    let upCoord = { x: 0, y: 0 }




    // 添加触发事件
    //注册手势监听 一个 JsApp 重复注册会导致上一个注册的回调失效
    hmApp.registerGestureEvent(function (event) {

      // 跳过默认手势
      return true
    })







  },
  onInit() {
    logger.debug('page onInit invoked')
  },

  onDestroy() {
    logger.debug('page onDestroy invoked')
    // 取消注册手势监听
    hmApp.unregisterGestureEvent()
  },
})
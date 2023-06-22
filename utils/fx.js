// CuberQAQ
// 用来提供线性动画的函数库

export class Fx {
  // x_start  开始的x坐标
  // x_end    结束的x坐标
  // total_time 总用时(ms)
  // speed    每刻内x坐标的步进距离
  // fx       过渡函数，给定一个x参数 要求返回函数值
  // func     执行的函数，每次的y值会作为第一个参数传给func
  // per_clock 每刻的毫秒数
  constructor({x_start,x_end,total_time,fx,func,enable,per_clock}) {
    this.x_start = x_start * 1.0
    this.x_end = x_end * 1.0
    this.speed = (x_end - x_start) / (total_time / per_clock)
    this.fx = fx
    this.func = func
    this.x_now = x_start
    this.per_clock = per_clock
    if(enable == undefined) {
      this.enable = true
    } 
    else {
      this.enable = enable
    }
    this.timer = null

    this.setEnable(this.enable)
  }
  restart() {
    this.x_now = this.x_start
    this.setEnable(false)
    this.setEnable(true)
  }
  setEnable(enable) {
    if(enable) {
      this.registerTimer()
    }
    else {
      if(this.timer) {
        timer.stopTimer(this.timer)
        this.timer = null
      }
    }
  }
  registerTimer() {
    this.timer = timer.createTimer(
      0,
      this.per_clock,
      (option) => {
        this.func(this.fx(this.x_now += this.speed))
        if(this.x_now > this.x_end) {
          //防止不到终点
          this.func(this.fx(this.x_end))
          //停止timer
          timer.stopTimer(this.timer)
          this.timer = null
          this.enable = false
        }
      },
      {}
    )
  }

}

// 二次平滑 进入与出去
export function EASE_IN_OUT_QUAD(now_time, begin, end, total_time) {
  let length = end - begin
  if((now_time /= total_time / 2) < 1) { // 未过半
    return length / 2 * now_time * now_time + begin
  }
  else { // 过半
    return -length / 2 * ((--now_time) * (now_time - 2) - 1) + begin
  }
}
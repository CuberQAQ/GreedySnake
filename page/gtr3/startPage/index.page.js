import {gettext} from "i18n"
const logger = DeviceRuntimeCore.HmLogger.getLogger('helloworld')
Page({
  build() {
    hmUI.createWidget(hmUI.widget.BUTTON, {
      x: px(110),
      y: px(115),
      w: px(260),
      h: px(100),
      radius: px(50),
      normal_color: 0x333333,
      press_color: 0x555555,
      text_size: px(36),
      text: gettext('startGame'),
      click_func: () => {hmApp.gotoPage({file: 'page/gtr3/main/index.page'})}
    })
    hmUI.createWidget(hmUI.widget.BUTTON, {
      x: px(110),
      y: px(265),
      w: px(260),
      h: px(100),
      radius: px(50),
      normal_color: 0x333333,
      press_color: 0x555555,
      text_size: px(36),
      text: gettext('startSet'),
      click_func: () => {hmApp.gotoPage({file: 'page/gtr3/set/index.page'})}
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
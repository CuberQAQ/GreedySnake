import { gettext } from "i18n"

export const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = hmSetting.getDeviceInfo()

export const ARC_EDGE_STYLE = {
  x: 0,
  y: 0,
  w: px(480),
  h: px(480),
  start_angle: 0,
  end_angle: 359,
  line_width: 2,
  color: 0x666666,
}

export const RECT_BACKGROUND_STYLE = {
  x: px(71),
  y: px(71),
  //w: px(338),
  //y: px(338),
  // color
  radius: px(5),
}

export const RECT_BLOCK_STYLE = {
  //x: px(71),
  //y: px(71),
  //w: px(338),
  //y: px(338),
  // color
  radius: px(4),
}
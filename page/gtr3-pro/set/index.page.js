import { SetItemMaker, SetPage, SetTool } from "../../../utils/setlist"
import { gettext } from 'i18n'
import { data } from "../../../utils/data"
const logger = DeviceRuntimeCore.HmLogger.getLogger('main')

var themeNumber = 3
Page({
  build() {
    let pageArray = [
      // mainPage
      SetPage.shellCreate({
        "name": "main",
        "items": [
          { // title
            "name": "title",
            "type": SetItemMaker.Types.TEXT,
            "style": SetItemMaker.Styles.HEAD,
            "data": { "text": gettext('setTitle') }
          },
          { // edgeNumber
            "name": "edgeNumber",
            "style": SetItemMaker.Styles.BODY,
            "type": SetItemMaker.Types.TEXT | SetItemMaker.Types.SUBTEXT | SetItemMaker.Types.BUTTON,
            "data": {
              "text": { "text": gettext('setEdgeNumberTitle') },
              "subtext": { "text": '' + data.json.edgeNumber },
              "button": {
                x: px(350),
                w: px(100),
                text_size: px(36),
                h: px(60),
                radius: px(30),
                normal_color: 0x333333,
                press_color: 0x555555,
                text: gettext('setEdgeNumberButton'),
                click_func() {
                  let availableList = [6, 8, 10]
                  let index = availableList.findIndex((value) => { return value == data.json.edgeNumber })
                  if (index < 0 || index >= availableList.length - 1) index = 0
                  else index++
                  console.log("index:" + index);
                  data.json.edgeNumber = availableList[index]
                  data.save()
                  setTool
                    .getPageByName("main")
                    .getItemByName("edgeNumber")
                    .widgets["subtext"]
                    .setProperty(hmUI.prop.TEXT, '' + availableList[index])
                }
              }
            }
          },
          { // speed
            "name": "speed",
            "style": SetItemMaker.Styles.BODY,
            "type": SetItemMaker.Types.TEXT | SetItemMaker.Types.SUBTEXT | SetItemMaker.Types.BUTTON,
            "data": {
              "text": { "text": gettext('setSpeedTitle') },
              "subtext": {
                "text": (() => {
                  switch (data.json.speed) {
                    case 0: return gettext('setSpeedLow')
                    case 1: return gettext('setSpeedNormal')
                    case 2: return gettext('setSpeedFast')
                    case 3: return gettext('setSpeedMaster')
                  }
                })()
              },
              "button": {
                x: px(350),
                w: px(100),
                text_size: px(36),
                h: px(60),
                radius: px(30),
                normal_color: 0x333333,
                press_color: 0x555555,
                text: gettext('setSpeedButton'),
                click_func() {
                  let availableList = [0, 1, 2, 3]
                  let index = availableList.findIndex((value) => { return value == data.json.speed })
                  if (index < 0 || index >= availableList.length - 1) index = 0
                  else index++
                  console.log("index:" + index);
                  data.json.speed = availableList[index]
                  data.save()
                  setTool
                    .getPageByName("main")
                    .getItemByName("speed")
                    .widgets["subtext"]
                    .setProperty(hmUI.prop.TEXT, '' + (() => {
                      switch (data.json.speed) {
                        case 0: return gettext('setSpeedLow')
                        case 1: return gettext('setSpeedNormal')
                        case 2: return gettext('setSpeedFast')
                        case 3: return gettext('setSpeedMaster')

                      }
                    })())
                }
              }
            }
          },
          { // useFx
            "name": "useFx",
            "style": SetItemMaker.Styles.BODY,
            "type": SetItemMaker.Types.TEXT | SetItemMaker.Types.SUBTEXT | SetItemMaker.Types.ARROW,
            "data": {
              "text": { "text": gettext('setUseFxTitle') },
              "subtext": { "text": gettext('setUseFxSubtext') },
              "arrow": { click_func: item => item.getParentPage().getParentTool().gotoPageByName("fx") }
            }
          },
          { // theme
            "name": "theme",
            "style": SetItemMaker.Styles.BODY,
            "type": SetItemMaker.Types.TEXT | SetItemMaker.Types.SUBTEXT | SetItemMaker.Types.BUTTON,
            "data": {
              "text": { "text": gettext('setThemeTitle') },
              "subtext": { "text": gettext('setThemeName' + data.json.theme) },
              "button": {
                x: px(350),
                w: px(100),
                text_size: px(36),
                h: px(60),
                radius: px(30),
                normal_color: 0x333333,
                press_color: 0x555555,
                text: gettext('setThemeButton'),
                click_func() {
                  let theme = data.json.theme
                  if (theme < 0 || theme >= themeNumber - 1) theme = 0
                  else theme++

                  data.json.theme = theme
                  data.save()
                  setTool
                    .getPageByName("main")
                    .getItemByName("theme")
                    .widgets["subtext"]
                    .setProperty(hmUI.prop.TEXT, gettext('setThemeName' + theme))
                }
              }
            }
          },
          { // TODO Finish (For test)
            "name": "finish",
            "style": SetItemMaker.Styles.BODY,
            "type": SetItemMaker.Types.BUTTON,
            "data": {
              "button": {
                normal_color: 0x333333,
                press_color: 0x555555,
                text_size: px(36),
                text: gettext('setFinish'),
                click_func() {
                  hmApp.gotoPage({ url: "page/gtr3-pro/startPage/index.page", param: "" })
                }
              }
            }
          },
          { // TODO Finish (For test)
            "name": "start",
            "style": SetItemMaker.Styles.BODY,
            "type": SetItemMaker.Types.BUTTON,
            "data": {
              "button": {
                normal_color: 0x333333,
                press_color: 0x555555,
                text_size: px(36),
                text: gettext('setStart'),
                click_func() {
                  hmApp.gotoPage({ url: "page/gtr3-pro/main/index.page", param: "" })
                }
              }
            }
          }
        ]
      }),
      // fx
      SetPage.shellCreate({
        "name": "fx",
        "items": [
          {
            "name": "title",
            "style": SetItemMaker.Styles.HEAD,
            "type": SetItemMaker.Types.TEXT,
            "data": { "text": gettext('setFxTitle') }
          },
          {
            "name": "color",
            "style": SetItemMaker.Styles.BODY,
            "type": SetItemMaker.Types.TEXT | SetItemMaker.Types.SWITCH,
            "data": {
              "text": {"text": gettext('setFxColorText')},
              "switch": {
                get_func() { return data.json.anim.color },
                click_func(checked, item) {
                  data.json.anim.color = checked
                  data.save()
                }
              }
            }
          },
          {
            "name": "size",
            "style": SetItemMaker.Styles.BODY,
            "type": SetItemMaker.Types.TEXT | SetItemMaker.Types.SWITCH,
            "data": {
              "text": {"text": gettext('setFxSizeText')},
              "switch": {
                get_func() { return data.json.anim.size },
                click_func(checked, item) {
                  data.json.anim.size = checked
                  data.save()
                }
              }
            }
          }

        ]
      })
    ]
    var setTool = new SetTool({
      pageArray,
      mainPageInstance: pageArray[0],
      onExit_func() { }
    })
    setTool.start()
  },
  onInit() {
    logger.debug('page onInit invoked')
  },

  onDestroy() {
    logger.debug('page onDestroy invoked')
  },
})
/**
 * 控制台日志着色工具
 * 玩家方绿色、敌方红色，其余（超时等系统伤害、流程日志）保持浏览器默认色
 *
 * 原理：console.log 的 %c 占位符后接一段 CSS，只对紧随其后的内容生效；
 * 需要整条日志着色时用 `%c${text}` 把文本紧跟在 %c 之后即可
 */

const SIDE_COLORS = {
  player: 'color:#4caf50',
  enemy: 'color:#f44336'
}

/**
 * 按阵营输出带颜色的日志
 * @param {'player'|'enemy'|null|undefined} side 日志所属阵营；传空表示不着色
 * @param {string} text 日志内容
 */
export function logBySide (side, text) {
  const style = SIDE_COLORS[side]
  if (style) {
    console.log(`%c${text}`, style)
  } else {
    console.log(text)
  }
}

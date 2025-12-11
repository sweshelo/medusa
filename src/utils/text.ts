/**
 * 全角英数字・記号を半角に変換
 */
export const toHalfWidth = (str: string): string => {
  return str
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => {
      return String.fromCharCode(s.charCodeAt(0) - 0xfee0)
    })
    .replace(/　/g, ' ') // 全角スペースを半角スペースに
    .replace(/．/g, '.') // 全角ピリオドを半角ピリオドに
}

/**
 * 半角英数字・記号を全角に変換
 */
export const toFullWidth = (str: string): string => {
  return str
    .replace(/[A-Za-z0-9]/g, (s) => {
      return String.fromCharCode(s.charCodeAt(0) + 0xfee0)
    })
    .replace(/ /g, '　') // 半角スペースを全角スペースに
    .replace(/\./g, '．') // 半角ピリオドを全角ピリオドに
}

import DOMPurify from 'isomorphic-dompurify'

// HTMLサニタイゼーション設定: XSS攻撃を防ぐため、特定のタグとスタイル属性のみを許可
const sanitizeConfig = {
  ALLOWED_TAGS: ['b', 'span', 'strong', 'em', 'i'],
  ALLOWED_ATTR: ['style'],
  ALLOWED_STYLES: {
    '*': {
      color: [/^#[0-9a-fA-F]{3,6}$/, /^rgb\(/, /^rgba\(/],
      'letter-spacing': [/^\d+px$/],
    },
  },
}

/**
 * HTMLを安全にサニタイズする関数
 * @param html - サニタイズ対象のHTML文字列
 * @returns サニタイズされたHTML文字列、入力がnull/undefinedの場合はundefined
 */
export const sanitizeHTML = (
  html: string | null | undefined,
): string | undefined => {
  if (!html) return undefined
  const sanitized = DOMPurify.sanitize(html, sanitizeConfig)
  return sanitized || undefined
}

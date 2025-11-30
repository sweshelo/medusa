export const getPlayerRankColor = (
  index: number | null,
  count: number | null,
) => {
  if (!count || index === null) return 'shiny-none'
  if (index === 0) return 'shiny-rainbow'
  if (index / count < 0.01) return 'shiny-gold'
  if (index / count < 0.05) return 'shiny-silver'
  if (index / count < 0.1) return 'shiny-copper'
  return 'shiny-none'
}

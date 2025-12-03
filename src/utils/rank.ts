export const getRank = (gauge: number) => {
  const border = Math.ceil(gauge / 100)
  switch (border) {
    case 1:
      return 'D-'
    case 2:
      return 'D'
    case 3:
      return 'D+'
    case 4:
      return 'C-'
    case 5:
      return 'C'
    case 6:
      return 'C+'
    case 7:
      return 'B-'
    case 8:
      return 'B'
    case 9:
      return 'B+'
    case 10:
      return 'A-'
    case 11:
      return 'A'
    case 12:
      return 'A+'
    case 13:
    default:
      return 'S'
  }
}

export const getRankColor = (rank: string) => {
  const rankAlphabet = rank.charAt(0)
  switch (rankAlphabet) {
    case 'D':
    case 'C':
      return 'green'
    case 'B':
      return 'shiny-copper'
    case 'A':
      return 'shiny-silver'
    case 'S':
      return 'shiny-gold'
    default:
      return 'gray'
  }
}

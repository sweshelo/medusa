export const getRank = (gauge: number) => {
  const border = Math.ceil(gauge / 100)
  switch (border) {
    case 0:
      return 'D-'
    case 1:
      return 'D'
    case 2:
      return 'D+'
    case 3:
      return 'C-'
    case 4:
      return 'C'
    case 5:
      return 'C+'
    case 6:
      return 'B-'
    case 7:
      return 'B'
    case 8:
      return 'B+'
    case 9:
      return 'A-'
    case 10:
      return 'A'
    case 11:
      return 'A+'
    default:
      return 'S'
  }
}

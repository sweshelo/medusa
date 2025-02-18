interface StageProps {
  name: string
}

const getShortenName = (name: string) => {
  switch (name) {
    case 'ウラシブヤ１':
      return 'シブ1'
    case 'ウラシブヤ２':
      return 'シブ2'
    case 'ウラシブヤ３':
      return 'シブ3'
    case 'ウラシブヤ1.2':
      return 'ハロシブ'
    case 'ウラオオサカ１':
      return 'サカ1'
    case 'ウラオオサカ２':
      return 'サカ2'
    case 'ウラオオサカ３':
      return 'サカ3'
    case 'ウラオキナワ１':
      return 'ナワ1'
    case 'ウラオキナワ２':
      return 'ナワ2'
    case 'ウラオキナワ３':
      return 'ナワ3'
    default:
      return name
  }
}

export const Stage = ({ name }: StageProps) => {
  return (
    <span className="border text-[8px] p-1 rounded border-orange-400">{getShortenName(name)}</span>
  )
}

interface StageProps {
  name: string
}

export const getShortenName = (name: string) => {
  switch (name) {
    case 'ウラシブヤ１':
    case 'ウラシブヤ':
      return 'シブ1'
    case 'ウラシブヤ２':
      return 'シブ2'
    case 'ウラシブヤ３':
      return 'シブ3'
    case 'ウラシブヤ1.2':
    case 'ウラシブヤ（ハロウィンver.）':
      return 'シブ1.2'
    case 'ウラオオサカ':
      return 'サカ1'
    case 'ウラオオサカ２':
      return 'サカ2'
    case 'ウラオオサカ３':
      return 'サカ3'
    case 'ウラオキナワ':
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

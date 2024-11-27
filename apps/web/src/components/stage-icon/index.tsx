interface StageProps {
  name: string
}

export const Stage = ({ name }: StageProps) => {
  return <span className="border text-[8px] p-1 rounded border-orange-400">{name}</span>
}

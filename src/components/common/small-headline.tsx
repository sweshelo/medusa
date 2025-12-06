interface SmallHeadlineProps {
  title: string
}

export const SmallHeadline = ({ title }: SmallHeadlineProps) => {
  return (
    <div className="p-[3px] rounded-lg bg-gray-300 shadow-sm my-2">
      <h3 className="text-lg text-center bg-gray-200 rounded-sm">{title}</h3>
    </div>
  )
}

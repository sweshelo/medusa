interface SmallHeadlineProps {
  title: string
}

export const SmallHeadline = ({ title }: SmallHeadlineProps) => {
  return (
    <div className="p-[3] rounded-lg bg-gray-300 shadow">
      <h3 className="text-lg text-center bg-gray-200 rounded">{title}</h3>
    </div>
  )
}

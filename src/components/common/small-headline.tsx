interface SmallHeadlineProps {
  title: string
}

export const SmallHeadline = ({ title }: SmallHeadlineProps) => {
  return (
    <div className="bg-gray-500 p-[3] rounded-lg">
      <h3 className="text-lg text-center bg-gray-300 rounded">{title}</h3>
    </div>
  )
}

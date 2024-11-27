interface HeadlineProps {
  title: string
}

export const Headline = ({ title }: HeadlineProps) => {
  return (
    <div className="mb-4 p-[3px] bg-white">
      <div className="p-2 bg-rainbow">
        <h2 className="text-xl font-bold text-center">{title}</h2>
      </div>
    </div>
  )
}

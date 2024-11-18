interface HeadlineProps {
  title: string
}

export const Headline = ({ title }: HeadlineProps) => {
  return (
    <div className="mt-4 mb-4 p-[4] bg-white">
      <div className="p-4 bg-gradient-to-r from-pink-200 via-green-200 to-purple-200">
        <h2 className="text-xl font-bold text-center">{title}</h2>
      </div>
    </div>
  )
}

interface Props {
  name: string
  index: number
}

export const GameTile = ({ name, index }: Props) => (
  <article
    className={`
      h-full bg-theme-20/40 border-2 border-theme-10 rounded-2xl xl:w-96 lg:w-72 w-full
      flex flex-col items-center justify-center text-theme-10 font-semibold gap-1
      animate-appear
    `}
    style={{ animationDelay: `${(index + 1) * 100}ms` }}
  >
    <span className='text-3xl'>{name}</span>
    <span className='text-xl animate-pulse'>Coming soon...</span>
  </article>
)

import { GameTile } from '@/components/play-page/GameTile'

export default function PlayPage() {
  const games = ['Speed Paint', 'Mirror Paint', 'Topic Paint']

  return (
    <main
      className={`
        mt-[var(--navbar-height)] w-screen h-[calc(100dvh-var(--navbar-height))]
        flex not-lg:flex-col lg:py-20 py-12 items-center justify-center xl:gap-8 gap-4
        lg:px-0 md:px-16 sm:px-8 px-4
      `}
    >
      {games.map((name, i) => (
        <GameTile name={name} key={i} />
      ))}
    </main>
  )
}

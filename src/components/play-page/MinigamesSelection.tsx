import { CanvasesGridHeader } from '@@/canvases-grid/CanvasesGridHeader'
import { usePlayContext } from '@/context/PlayContext'
import { MinigameTile } from './MinigameTile'

export const MinigamesSelection = () => {
  const { setIsRenderingGame } = usePlayContext()

  const games: Minigame[] = [
    {
      name: 'Speed Paint',
      details: {
        img: '/minigames/speed-paint.webp',
        desc: 'Peek at a painting, then recreate it as fast as you can.'
      }
    },
    { name: 'Half Paint' },
    { name: 'Theme Paint' }
  ]

  return (
    <section
      className={`
        min-h-full flex not-lg:flex-col items-center lg:justify-center
        xl:gap-8 gap-4 lg:px-0 md:px-16 sm:px-8 px-4 not-lg:pt-12
      `}
    >
      <CanvasesGridHeader className='lg:hidden' />

      {games.map(({ name, details }, index) => (
        <MinigameTile
          {...{ name, index, details }}
          key={index}
          onClick={() => {
            details && setIsRenderingGame(true)
          }}
        />
      ))}
    </section>
  )
}

export interface Minigame {
  name: string
  details?: {
    desc: string
    img: string
  }
}

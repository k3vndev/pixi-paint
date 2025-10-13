import { CanvasesGridHeader } from '@@/canvases-grid/CanvasesGridHeader'
import { MinigameTile } from './MinigameTile'

interface Props {
  setRenderingGame: (value: boolean) => void
}

export const MinigamesSelection = ({ setRenderingGame }: Props) => {
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
        min-h-full h-fit flex not-lg:flex-col lg:py-20 py-12 items-center lg:justify-center
        not-lg:justify-start lg:mt-0 sm:mt-70 mt-82 xl:gap-8 gap-4 lg:px-0 md:px-16 sm:px-8 px-4
      `}
    >
      <CanvasesGridHeader className='lg:hidden' />

      {games.map(({ name, details }, index) => (
        <MinigameTile
          {...{ name, index, details }}
          key={index}
          onClick={() => {
            details && setRenderingGame(true)
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

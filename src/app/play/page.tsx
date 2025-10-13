'use client'

import { useState } from 'react'
import { CanvasesGridHeader } from '@/components/canvases-grid/CanvasesGridHeader'
import { GameTile } from '@/components/play-page/GameTile'
import { PaintMinigame } from '@/components/play-page/PaintMinigame'
import { useDefaultPrevention } from '@/hooks/useDefaultPrevention'

export interface Game {
  name: string
  details?: {
    desc: string
    img: string
  }
}

export default function PlayPage() {
  const [renderingGame, setRenderingGame] = useState<boolean>(false)

  useDefaultPrevention()

  const games: Game[] = [
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
    <main
      className={`
        mt-[var(--navbar-height)] h-[calc(100dvh-var(--navbar-height))] w-screen
        flex not-lg:flex-col lg:py-20 py-12 items-center lg:justify-center xl:gap-8 gap-4
        lg:px-0 md:px-16 sm:px-8 px-4
      `}
    >
      <CanvasesGridHeader />
      {renderingGame ? (
        <PaintMinigame />
      ) : (
        games.map(({ name, details }, index) => (
          <GameTile
            {...{ name, index, details }}
            key={index}
            onClick={() => {
              details && setRenderingGame(true)
            }}
          />
        ))
      )}
    </main>
  )
}

'use client'

import { useState } from 'react'
import { GameTile } from '@/components/play-page/GameTile'
import { PaintMinigame } from '@/components/play-page/PaintMinigame'
import { useDefaultPrevention } from '@/hooks/useDefaultPrevention'

interface Game {
  name: string
  component?: React.ReactNode
}

export default function PlayPage() {
  const [renderingGame, setRenderingGame] = useState<React.ReactNode>(null)
  useDefaultPrevention()

  const games: Game[] = [
    { name: 'Speed Paint', component: <PaintMinigame /> },
    { name: 'Half Paint' },
    { name: 'Theme Paint' }
  ]

  return (
    <main
      className={`
        mt-[var(--navbar-height)] w-screen h-[calc(100dvh-var(--navbar-height))]
        flex not-lg:flex-col lg:py-20 py-12 items-center justify-center xl:gap-8 gap-4
        lg:px-0 md:px-16 sm:px-8 px-4
      `}
    >
      {renderingGame ??
        games.map(({ name, component }, index) => (
          <GameTile
            {...{ name, index }}
            key={index}
            onClick={() => {
              component && setRenderingGame(component)
            }}
          />
        ))}
    </main>
  )
}

'use client'

import { useState } from 'react'
import { MinigamesSelection } from '@/components/play-page/MinigamesSelection'
import { PaintMinigame } from '@/components/play-page/PaintMinigame'
import { PlayContext } from '@/context/PlayContext'
import { useDefaultPrevention } from '@/hooks/useDefaultPrevention'

export default function PlayPage() {
  useDefaultPrevention()
  const [isRenderingGame, setIsRenderingGame] = useState<boolean>(false)

  return (
    <PlayContext.Provider value={{ isRenderingGame, setIsRenderingGame }}>
      <main
        className={`
          mt-[var(--navbar-height)] min-h-[calc(100dvh-var(--navbar-height))] w-screen
          relative flex items-center justify-center
        `}
      >
        {isRenderingGame ? <PaintMinigame /> : <MinigamesSelection />}
      </main>
    </PlayContext.Provider>
  )
}

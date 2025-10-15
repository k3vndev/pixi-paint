'use client'

import { useState } from 'react'
import { MinigamesSelection } from '@/components/play-page/MinigamesSelection'
import { PaintMinigame } from '@/components/play-page/PaintMinigame'
import { useDefaultPrevention } from '@/hooks/useDefaultPrevention'

export default function PlayPage() {
  useDefaultPrevention()
  const [renderingGame, setRenderingGame] = useState<boolean>(false)

  return (
    <main
      className={`
        mt-[var(--navbar-height)] min-h-[calc(100dvh-var(--navbar-height))] w-screen
        relative flex items-center justify-center
      `}
    >
      {renderingGame ? <PaintMinigame /> : <MinigamesSelection {...{ setRenderingGame }} />}
    </main>
  )
}

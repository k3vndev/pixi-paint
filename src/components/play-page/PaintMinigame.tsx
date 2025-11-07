import { BLANK_PIXELS } from '@consts'
import { useState } from 'react'
import { useCanvasOutlineTimer } from '@/hooks/canvas/useCanvasOutlineTimer'
import { useWait } from '@/hooks/time/useWait'
import { useDialogMenu } from '@/hooks/useDialogMenu'
import { useFreshRefs } from '@/hooks/useFreshRefs'
import { usePlayMinigame } from '@/hooks/usePlayMinigame'
import { usePaintStore } from '@/store/usePaintStore'
import { calcPaintingsSimilarity } from '@/utils/calcPaintingsSimilarity'
import { getRandomItem } from '@/utils/getRandomItem'
import { DMButton } from '../dialog-menu/DMButton'
import { DMCanvasImage } from '../dialog-menu/DMCanvasImage'
import { DMHeader } from '../dialog-menu/DMHeader'
import { DMParagraph } from '../dialog-menu/DMParagraph'
import { DMZone } from '../dialog-menu/DMZone'
import { DMZoneButtons } from '../dialog-menu/DMZoneButtons'
import { PaintWorkspace } from '../paint-workspace/PaintWorkspace'
import type { CanvasOutlineConfig } from '../paint-workspace/paint-canvas/CanvasOutline'
import { TitleDisplay, useTitleDisplay } from './TitleDisplay'

export const PaintMinigame = () => {
  const [isShowingCanvas, setIsShowingCanvas] = useState(false)
  const [canvasIsDisabled, setCanvasIsDisabled] = useState(true)

  const editingPixels = usePaintStore(s => s.pixels)
  const setEditingPixels = usePaintStore(s => s.setPixels)

  const [canvasOutlineConfig, setCanvasOutlineConfig] = useState<CanvasOutlineConfig>({})
  const outlineTimer = useCanvasOutlineTimer()

  const TIMES = {
    PEEK: 4.5,
    PAINT: 30
  }

  const setTimerIsVisible = (value: boolean) => {
    const opacity = value ? 'opacity-100' : 'opacity-0'

    setCanvasOutlineConfig(c => ({
      ...c,
      className: {
        ...c.className,
        conic: opacity
      }
    }))
  }

  const playOutlineAppearAnimation = () => {
    setCanvasOutlineConfig(c => ({ ...c, visible: true }))
  }

  const refs = useFreshRefs({ editingPixels, canvasOutlineConfig })
  const wait = useWait()

  const { displayTitle, hideTitle, titleState } = useTitleDisplay()
  const { openMenu } = useDialogMenu()

  const startPaintingIntros = [
    ['Look closely…', "you'll need every pixel!"],
    ["Don't blink…", "or you'll forget a spot!"],
    ['Study the pixels…', 'your time starts after!'],
    ['Memorize it fast…', 'the clock is ticking!'],
    ['Eyes on the pixels…', 'speedster, you got this!'],
    ["Don't look away…", 'focus is key!'],
    ['Steady now…', 'you can do this!'],
    ['Peek, memorize…', 'and then go!'],
    ['Just one glance…', 'make it count!'],
    ['Pixels are watching…', "don't mess up!"],
    ['Remember this…', 'recreate it perfectly!']
  ]

  const mainSequence = async () => {
    try {
      const originalPixels = pickRandomMinigamePainting()
      setEditingPixels(SEMI_TRANSPARENT_PIXELS)

      await wait.forSeconds(0.1)
      setIsShowingCanvas(true)

      await wait.forSeconds(0.1)

      playOutlineAppearAnimation()
      outlineTimer.complete()
      setTimerIsVisible(true)

      await wait.forSeconds(0.4)

      // Display title and initialize canvas outline
      const randomTitle = getRandomItem(startPaintingIntros)
      displayTitle(...randomTitle)
      await wait.forSkippeable(2.6)
      hideTitle()

      await wait.forSeconds(0.25)

      animateSetPixels(originalPixels)
      setTimerIsVisible(false)
      await wait.forSeconds(0.5)

      setTimerIsVisible(true)
      await outlineTimer.start(TIMES.PEEK)

      animateSetPixels(BLANK_PIXELS)
      await wait.forSeconds(0.4)
      setTimerIsVisible(false)

      displayTitle('Paint!')
      await wait.forSeconds(0.7)
      hideTitle()

      outlineTimer.reset()
      setTimerIsVisible(true)

      await wait.forSeconds(0.5)

      setCanvasIsDisabled(false)
      await outlineTimer.start(TIMES.PAINT)

      await wait.forSeconds(0.2)
      setCanvasIsDisabled(true)

      displayTitle('Time up!')
      await wait.forSeconds(0.7)
      hideTitle()

      // Wait for the user to view
      await wait.forSeconds(1)
      showResultsScreen(originalPixels)
    } catch {}
  }

  const { animateSetPixels, pickRandomMinigamePainting, SEMI_TRANSPARENT_PIXELS, restartMinigame } =
    usePlayMinigame({
      mainSequence
    })

  const showResultsScreen = (originalPixels: string[]) => {
    // Calculate results
    const score = calcPaintingsSimilarity(originalPixels, refs.current.editingPixels)

    // Open results menu
    openMenu(
      <>
        <DMHeader icon='gamepad'>Your results :)</DMHeader>
        <DMParagraph>You got a score of {(score * 100).toFixed(0)}%</DMParagraph>

        <DMZone className='flex gap-4'>
          <DMCanvasImage pixels={originalPixels} />
          <DMCanvasImage pixels={refs.current.editingPixels} />
        </DMZone>

        <DMZoneButtons>
          <DMButton icon='cross' empty>
            Minigames selection
          </DMButton>
          <DMButton icon='gamepad' onClick={restartMinigame}>
            Play again
          </DMButton>
        </DMZoneButtons>
      </>
    )
  }

  return (
    <>
      {isShowingCanvas && (
        <PaintWorkspace
          disabled={canvasIsDisabled}
          outlineConfig={canvasOutlineConfig}
          hideColorbarSelector
        />
      )}

      <TitleDisplay {...titleState} />
    </>
  )
}

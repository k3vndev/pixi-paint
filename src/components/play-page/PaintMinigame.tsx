import { BLANK_PIXELS, CANVAS_PIXELS_LENGHT, COLOR_PALETTE } from '@consts'
import { useEffect, useState } from 'react'
import { useCanvasOutlineTimer } from '@/hooks/canvas/useCanvasOutlineTimer'
import { useWait } from '@/hooks/time/useWait'
import { useBucketPixels } from '@/hooks/useBucketPixels'
import { useDialogMenu } from '@/hooks/useDialogMenu'
import { useFreshRefs } from '@/hooks/useFreshRefs'
import minigamePaintings from '@/lib/minigame-paintings.json'
import { usePaintStore } from '@/store/usePaintStore'
import { calcMiddlePixelsIndexes } from '@/utils/calcMiddlePixels'
import { calcPaintingsSimilarity } from '@/utils/calcPaintingsSimilarity'
import { canvasParser } from '@/utils/canvasParser'
import { getRandomItem } from '@/utils/getRandomItem'
import { DMCanvasImage } from '../dialog-menu/DMCanvasImage'
import { DMHeader } from '../dialog-menu/DMHeader'
import { DMParagraph } from '../dialog-menu/DMParagraph'
import { DMZone } from '../dialog-menu/DMZone'
import { PaintWorkspace } from '../paint-workspace/PaintWorkspace'
import type { CanvasOutlineConfig } from '../paint-workspace/paint-canvas/CanvasOutline'
import { TitleDisplay, useTitleDisplay } from './TitleDisplay'

export const PaintMinigame = () => {
  const [isShowingCanvas, setIsShowingCanvas] = useState(false)
  const [canvasIsDisabled, setCanvasIsDisabled] = useState(true)

  const editingPixels = usePaintStore(s => s.pixels)
  const setEditingPixels = usePaintStore(s => s.setPixels)

  const setPrimaryColor = usePaintStore(s => s.setPrimaryColor)
  const setSecondaryColor = usePaintStore(s => s.setSecondaryColor)

  const [canvasOutlineConfig, setCanvasOutlineConfig] = useState<CanvasOutlineConfig>({})
  const outlineTimer = useCanvasOutlineTimer()

  const TIMES = {
    PEEK: 4.5,
    PAINT: 29
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
  const { paintBucketPixels } = useBucketPixels()
  const { openMenu } = useDialogMenu()

  const animateSetPixels = (pixels: string[]) =>
    paintBucketPixels({
      startIndexes: calcMiddlePixelsIndexes(),
      paintGenerationAction: generation => {
        const { editingPixels } = refs.current
        const editingPixelsClone = structuredClone(editingPixels)

        for (const { index } of generation) {
          editingPixelsClone[index] = pixels[index]
        }
        setEditingPixels(editingPixelsClone)
      }
    })

  useEffect(() => {
    setPrimaryColor(COLOR_PALETTE.RED)
    setSecondaryColor(COLOR_PALETTE.WHITE)

    mainSequence()
  }, [])

  const pickRandomMinigamePainting = () => {
    const randomPainting = getRandomItem(minigamePaintings)
    const parsed = canvasParser.fromStorage(randomPainting as any)

    if (!parsed) throw new Error()
    return parsed.pixels
  }

  const startPaintingIntros = [
    ['Look closely…', 'you’ll need every pixel!'],
    ['Don’t blink…', 'or you’ll forget a spot!'],
    ['Study the pixels…', 'your time starts after!'],
    ['Memorize it fast…', 'the clock is ticking!'],
    ['Eyes on the pixels…', 'speedster, you got this!'],
    ['Peek, memorize…', 'and then go!'],
    ['Just one glance…', 'make it count!'],
    ['Pixels are watching…', 'don’t mess up!'],
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

      displayTitle('TIME!')
      await wait.forSeconds(0.7)
      hideTitle()

      // Wait for the user to view
      await wait.forSeconds(1.3)

      // Calculate results here
      const score = calcPaintingsSimilarity(originalPixels, refs.current.editingPixels)
      openMenu(
        <>
          <DMHeader icon='gamepad'>Your results</DMHeader>
          <DMParagraph>You got a score of {(score * 100).toFixed(0)}%</DMParagraph>

          <DMZone className='flex gap-4'>
            <DMCanvasImage pixels={originalPixels} />
            <DMCanvasImage pixels={refs.current.editingPixels} />
          </DMZone>
        </>
      )
    } catch {}
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

const SEMI_TRANSPARENT_PIXELS = Array(CANVAS_PIXELS_LENGHT).fill('#ffffffc8')
